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
      // Use more generic document type
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",  // Accept any file type
        copyToCacheDirectory: true
      });
      
      console.log("Document picker result:", result); // Add this debug line
      
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        // Expo SDK 46+ returns different structure
        const uri = result.assets[0].uri;
        console.log("Reading file from URI:", uri);
        
        try {
          const content = await FileSystem.readAsStringAsync(uri);
          console.log("File content (first 100 chars):", content.substring(0, 100));
          setFileContent(content);
          processCSVData(content);
        } catch (readError) {
          console.error("Error reading file:", readError);
          Alert.alert('Error', 'Failed to read the CSV file content.');
        }
      } else if (result.type === 'success') {
        // Older Expo SDK format
        console.log("Reading file from URI (old format):", result.uri);
        const content = await FileSystem.readAsStringAsync(result.uri);
        setFileContent(content);
        processCSVData(content);
      } else {
        console.log("Document picking cancelled or failed");
      }
    } catch (error) {
      console.error("Document picker error:", error);
      Alert.alert('Error', 'Failed to load the CSV file.');
    } finally {
      setUploading(false);
    }
  };

  const processCSVData = (csvContent) => {
    try {
      console.log("Processing CSV data, length:", csvContent.length);
      const lines = csvContent.split('\n');
      console.log("Found lines:", lines.length);
      
      // Output first line to see format
      if (lines.length > 0) {
        console.log("First line:", lines[0]);
      }
      
      // Initialize results array
      const parsedResults = [];
      
      // Start from index 1 to skip header row
      const startIdx = 1;
      
      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Based on the log, your CSV format appears to be:
        // PatientID,Gender,Ethnicity,Age,Creatinine
        const [patientID, gender, ethnicity, ageStr, creatinine] = line.split(',');
        
        // Skip invalid rows
        if (!patientID || gender === undefined || !ethnicity || !ageStr || !creatinine) {
          continue;
        }
        
        // Parse age directly from CSV
        const age = parseInt(ageStr);
        
        // Skip if age is outside valid range
        if (isNaN(age) || age < 18 || age > 110) {
          continue;
        }
        
        // Your sample data shows Gender as 0/1 where 0 appears to be female and 1 is male
        const isFemale = gender === '0';
        
        // Your sample data shows Ethnicity as 'B'/'O' where B appears to be Black
        const isBlack = ethnicity === 'B';
        
        const creatValue = parseFloat(creatinine);
        
        // Skip invalid creatinine values
        if (isNaN(creatValue) || creatValue <= 0) {
          continue;
        }
        
        const result = calculateEGFR(creatValue, age, isFemale, isBlack);
        
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
    } catch (error) {
      console.error("Error processing file:", error);
      Alert.alert('Error', 'Failed to process the CSV data. Please check the format.');
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
        PatientID,Gender,Ethnicity,Age,Creatinine
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
        placeholder="PatientID,Gender,Ethnicity,Age,Creatinine"
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0072CE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  textArea: {
    borderColor: '#CCC',
    borderWidth: 1,
    padding: 10,
    height: 100,
    fontSize: 14,
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#005EB8',
    marginBottom: 20,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  idCell: {
    flex: 2, // give more space to ID
  },
  stageGood: {
    color: 'green',
  },
  stageWarning: {
    color: 'orange',
  },
  stageCritical: {
    color: 'red',
  },
});

export default BatchUploadScreen;