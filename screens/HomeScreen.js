// screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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