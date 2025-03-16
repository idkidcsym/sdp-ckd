// screens/UserTypeScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../app.js';

const UserTypeScreen = ({ navigation }) => {
  const { userSession, setUserSession } = useContext(UserContext);

  const selectUserType = (type) => {
    setUserSession({
      ...userSession,
      userType: type
    });
    
    if (type === 'patient') {
      navigation.navigate('PatientCalculator');
    } else {
      navigation.navigate('ClinicianCalculator');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>I am a:</Text>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => selectUserType('patient')}
      >
        <Text style={styles.optionButtonText}>Patient</Text>
        <Text style={styles.optionDescription}>Calculate my personal eGFR</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => selectUserType('clinician')}
      >
        <Text style={styles.optionButtonText}>Healthcare Professional</Text>
        <Text style={styles.optionDescription}>Calculate eGFR for patients</Text>
      </TouchableOpacity>
    </View>
  );
};
