// screens/HistoryScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { UserContext } from '../userContext';

const HistoryScreen = ({ navigation }) => {
  const { userSession } = useContext(UserContext);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => navigation.navigate('Result', { 
        result: { 
          eGFR: item.eGFR, 
          stage: item.stage 
        },
        patientInfo: item.patientId ? { id: item.patientId } : null
      })}
    >
      <View style={styles.historyHeader}>
        <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
        {item.patientId && (
          <Text style={styles.patientId}>Patient: {item.patientId}</Text>
        )}
      </View>
      
      <View style={styles.historyDetails}>
        <View style={styles.historyValue}>
          <Text style={styles.historyLabel}>eGFR:</Text>
          <Text style={styles.historyData}>{item.eGFR.toFixed(1)}</Text>
        </View>
        
        <View style={styles.historyValue}>
          <Text style={styles.historyLabel}>Stage:</Text>
          <Text style={[styles.historyData, 
            item.stage <= 2 ? styles.stageGood : 
            item.stage === '3A' || item.stage === '3B' ? styles.stageWarning : 
            styles.stageCritical]}>
            {item.stage}
          </Text>
        </View>
        
        <View style={styles.historyValue}>
          <Text style={styles.historyLabel}>Creatinine:</Text>
          <Text style={styles.historyData}>{item.creatinine} μmol/L</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculation History</Text>
      
      {userSession.calculationHistory.length === 0 ? (
        <Text style={styles.emptyText}>No calculation history available.</Text>
      ) : (
        <FlatList
          data={[...userSession.calculationHistory].reverse()}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0', // Light grey background
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333', // Dark text for better readability
    marginBottom: 20, // Spacing between title and content
  },
  emptyText: {
    fontSize: 18,
    color: '#666', // Medium grey text for empty state
    textAlign: 'center', // Center text when no history is available
    marginTop: 50, // Push text down to be more centered
  },
  historyItem: {
    backgroundColor: '#fff', // White background for each item
    padding: 15,
    borderRadius: 10,
    marginBottom: 10, // Space between items
    shadowColor: "#000", // Shadow for 3D effect
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out date and patient ID
    marginBottom: 10, // Space between header and details
  },
  historyDate: {
    fontSize: 16,
    color: '#0072CE', // Use NHS blue for date to tie into overall theme
  },
  patientId: {
    fontSize: 16,
    color: '#0072CE', // Same as date for consistency
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out details evenly
  },
  historyValue: {
    flexDirection: 'column', // Stack label and data vertically
  },
  historyLabel: {
    fontSize: 14,
    color: '#666', // Medium grey for labels
  },
  historyData: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Dark grey for important data
  },
  stageGood: {
    color: 'green', // Green for good stages
  },
  stageWarning: {
    color: 'orange', // Orange for warning stages
  },
  stageCritical: {
    color: 'red', // Red for critical stages
  },
  list: {
    flexGrow: 1,
  },
  button: {
    backgroundColor: '#0072CE', // NHS blue for buttons
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#005EB8', // Darker NHS blue for secondary button
  },
});

export default HistoryScreen;