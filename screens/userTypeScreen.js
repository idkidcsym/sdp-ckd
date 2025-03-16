// screens/UserTypeScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../userContext';

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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#0072CE', // NHS Blue
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#0072CE',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionButtonText: {
    color: '#0072CE',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionDescription: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default UserTypeScreen;