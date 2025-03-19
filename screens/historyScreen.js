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
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0', 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333', 
    marginBottom: 20, 
  },
  emptyText: {
    fontSize: 18,
    color: '#666', 
    textAlign: 'center', 
    marginTop: 50, 
  },
  historyItem: {
    backgroundColor: '#fff', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 10, 
    shadowColor: "#000", 
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
    justifyContent: 'space-between', 
    marginBottom: 10, 
  },
  historyDate: {
    fontSize: 16,
    color: '#0072CE', 
  },
  patientId: {
    fontSize: 16,
    color: '#0072CE', 
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  historyValue: {
    flexDirection: 'column', 
  },
  historyLabel: {
    fontSize: 14,
    color: '#666', 
  },
  historyData: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', 
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
  list: {
    flexGrow: 1,
  },
  button: {
    backgroundColor: '#0072CE', 
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
    backgroundColor: '#005EB8', 
  },
});

export default HistoryScreen;