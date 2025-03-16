// screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { UserContext } from '../userContext';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image 
        source={require('../assets/kidney-icon.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <Text style={styles.title}>NHS CKD Risk Calculator</Text>
      <Text style={styles.subtitle}>Calculate your estimated Glomerular Filtration Rate (eGFR)</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('UserType')}
      >
        <Text style={styles.buttonText}>Start Calculation</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => navigation.navigate('Info')}
      >
        <Text style={styles.buttonText}>Learn About CKD</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0072CE', // NHS Blue
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#0072CE', // NHS Blue
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#005EB8', // Darker NHS Blue
  },
});

export default HomeScreen;