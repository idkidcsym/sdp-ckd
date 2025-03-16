import React, { useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { UserContext } from '../userContext';
import { calculateEGFR } from '../utils/ckdCalculator';

const BatchUploadScreen = ({ navigation }) => {
  const { userSession, setUserSession } = useContext(UserContext);
  const [fileContent, setFileContent] = useState('');
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickCSVFile = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true
      });
      
      if (result.type === 'success') {
        const content = await FileSystem.readAsStringAsync(result.uri);
        setFileContent(content);
        processCSVData(content);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load the CSV file.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const processCSVData = (csvContent) => {
    const lines = csvContent.split('\n');
    const parsedResults = [];
    
    // Skip header row if it exists
    const startIdx = lines[0].includes('patientID') ? 1 : 0;
    
    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const [patientID, gender, yearOfBirth, ethnicity, creatinine] = line.split(',');
      
      // Skip invalid rows
      if (!patientID || !gender || !yearOfBirth || !ethnicity || !creatinine) {
        continue;
      }
      
      // Calculate age
      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(yearOfBirth);
      
      // Skip if age is outside valid range
      if (age < 18 || age > 110) {
        continue;
      }
      
      const isFemale = gender.toLowerCase() === 'female' || gender.toLowerCase() === 'f';
      const isBlack = ethnicity.toLowerCase().includes('black');
      const creatValue = parseFloat(creatinine);
      
      // Skip invalid creatinine values
      if (isNaN(creatValue) || creatValue <= 0) {
        continue;
      }
      
      const result = calculateEGFR(creatValue, age, isFemale, isBlack);
      // screens/BatchUploadScreen.js (continued)
      parsedResults.push({
        patientID,
        age,
        gender: isFemale ? 'female' : 'male',
        ethnicity,
        creatinine: creatValue,
        eGFR: result.eGFR,
        stage: result.stage
      });
    }
    
    setResults(parsedResults);
    
    // Update session with batch results
    if (parsedResults.length > 0) {
      const newHistory = parsedResults.map(item => ({
        date: new Date().toISOString(),
        patientId: item.patientID,
        creatinine: item.creatinine,
        eGFR: item.eGFR,
        stage: item.stage
      }));
      
      setUserSession({
        ...userSession,
        calculationHistory: [
          ...userSession.calculationHistory,
          ...newHistory
        ]
      });
    }
  };

  const handleManualCSVInput = (text) => {
    setFileContent(text);
  };

  const processManualInput = () => {
    if (fileContent.trim()) {
      processCSVData(fileContent);
    } else {
      Alert.alert('Error', 'Please enter CSV data first.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Batch eGFR Calculation</Text>
      <Text style={styles.description}>
        Upload a CSV file with patient data in the following format:
        patientID, gender, yearOfBirth, ethnicity, creatinine
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={pickCSVFile}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? 'Processing...' : 'Select CSV File'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.orText}>OR</Text>
      
      <Text style={styles.label}>Enter CSV data manually:</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={5}
        value={fileContent}
        onChangeText={handleManualCSVInput}
        placeholder="patientID,gender,yearOfBirth,ethnicity,creatinine"
      />
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={processManualInput}
      >
        <Text style={styles.buttonText}>Process Data</Text>
      </TouchableOpacity>
      
      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Results ({results.length})</Text>
          
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.idCell]}>Patient ID</Text>
            <Text style={styles.tableCell}>eGFR</Text>
            <Text style={styles.tableCell}>Stage</Text>
          </View>
          
          {results.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.idCell]} numberOfLines={1}>{item.patientID}</Text>
              <Text style={styles.tableCell}>{item.eGFR.toFixed(1)}</Text>
              <Text style={[styles.tableCell, 
                item.stage <= 2 ? styles.stageGood : 
                item.stage === '3A' || item.stage === '3B' ? styles.stageWarning : 
                styles.stageCritical]}>
                {item.stage}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default BatchUploadScreen;