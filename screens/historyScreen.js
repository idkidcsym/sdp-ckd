// screens/HistoryScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { UserContext } from '../App';

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

// screens/InfoScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const InfoScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Chronic Kidney Disease (CKD)</Text>
      
      <Image 
        source={require('../assets/kidney-diagram.png')} 
        style={styles.image} 
        resizeMode="contain"
      />
      
      <Text style={styles.sectionTitle}>What is CKD?</Text>
      <Text style={styles.text}>
        Chronic Kidney Disease (CKD) is a long-term condition in which the kidneys do not function 
        properly, leading to impaired functionality. Various conditions can cause CKD. Most of the time, 
        CKD does not produce symptoms and may remain undetectable until it has reached an advanced stage.
      </Text>
      
      <Text style={styles.sectionTitle}>Understanding eGFR</Text>
      <Text style={styles.text}>
        The estimated Glomerular Filtration Rate (eGFR) is a measure of how well your kidneys are filtering
        waste from your blood. It's calculated using a blood test that measures creatinine, along with your
        age, sex, and race.
      </Text>
      
      <Text style={styles.sectionTitle}>CKD Stages</Text>
      
      <View style={styles.stageTable}>
        <View style={styles.stageRow}>
          <Text style={[styles.stageCell, styles.stageHeader]}>Stage</Text>
          <Text style={[styles.stageCell, styles.stageHeader]}>eGFR Value</Text>
          <Text style={[styles.stageCell, styles.stageHeader]}>Description</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>1</Text>
          <Text style={styles.stageCell}>&gt;90</Text>
          <Text style={styles.stageCell}>Normal kidney function but with other findings</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>2</Text>
          <Text style={styles.stageCell}>60-89</Text>
          <Text style={styles.stageCell}>Mildly reduced kidney function</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>3A</Text>
          <Text style={styles.stageCell}>45-59</Text>
          <Text style={styles.stageCell}>Moderately reduced kidney function</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>3B</Text>
          <Text style={styles.stageCell}>30-44</Text>
          <Text style={styles.stageCell}>Moderately reduced kidney function</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>4</Text>
          <Text style={styles.stageCell}>15-29</Text>
          <Text style={styles.stageCell}>Severely reduced kidney function</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>5</Text>
          <Text style={styles.stageCell}>&lt;15</Text>
          <Text style={styles.stageCell}>Very severe, or end stage kidney failure</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Managing CKD</Text>
      <Text style={styles.text}>
        Managing cardiovascular risk is a key priority in CKD. Most experts recommend a target blood 
        pressure of 130/80 mmHg for people with CKD. Cigarette smoking is associated with poor 
        outcomes in CKD, with 31% of attributable risk linked to smoking.
      </Text>
      
      <Text style={styles.text}>
        Earlier identification of CKD in primary care, improved management of cardiovascular risk 
        factors, avoiding medications that impair renal function, and timely specialist referrals 
        may improve long-term outcomes.
      </Text>
      
      <Text style={styles.disclaimer}>
        This app is for informational purposes only. Always consult with a healthcare professional 
        for medical advice and treatment.
      </Text>
    </ScrollView>
  );
};