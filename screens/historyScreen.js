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

export default HistoryScreen;