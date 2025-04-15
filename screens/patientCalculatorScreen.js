// screens/PatientCalculatorScreen.js
import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Switch, KeyboardAvoidingView, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../userContext';
import { calculateEGFR } from '../utils/ckdCalculator';

const PatientCalculatorScreen = ({ navigation }) => {
  const { userSession, setUserSession } = useContext(UserContext);

  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    isBlack: false,
    creatinine: '',
    creatinineUnit: 'micromol/l',
    nhsNumber: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  // Load saved data if exists
  React.useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('patientData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData({ ...formData, ...parsedData });
          setUserSession({
            ...userSession,
            isLoggedIn: true,
            userId: parsedData.nhsNumber,
            userProfile: parsedData
          });
        }
      } catch (error) {
        console.error('Error loading saved data', error);
      }
    };

    loadSavedData();
  }, []);

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.age || isNaN(formData.age) || formData.age < 18 || formData.age > 110) {
      newErrors.age = 'Age must be between 18 and 110';
      isValid = false;
    }

    if (!formData.creatinine || isNaN(formData.creatinine) || formData.creatinine <= 0) {
      newErrors.creatinine = 'Please enter a valid creatinine value';
      isValid = false;
    }

    if (formData.rememberMe && (!formData.nhsNumber || formData.nhsNumber.length !== 10)) {
      newErrors.nhsNumber = 'Please enter a valid 10-digit NHS number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;

    // Convert creatinine to micromol/l if needed
    let creatValue = parseFloat(formData.creatinine);
    if (formData.creatinineUnit === 'mg/dL') {
      creatValue = creatValue * 88.4; // Convert to micromol/l
    }

    // Calculate eGFR
    const result = calculateEGFR(
      creatValue,
      parseInt(formData.age),
      formData.gender === 'female',
      formData.isBlack
    );

    // Save data if remember me is checked
    if (formData.rememberMe) {
      try {
        await AsyncStorage.setItem('patientData', JSON.stringify({
          age: formData.age,
          gender: formData.gender,
          isBlack: formData.isBlack,
          nhsNumber: formData.nhsNumber
        }));

        setUserSession({
          ...userSession,
          isLoggedIn: true,
          userType: 'patient',
          userId: formData.nhsNumber,
          userProfile: {
            age: formData.age,
            gender: formData.gender,
            isBlack: formData.isBlack
          },
          calculationHistory: [
            ...userSession.calculationHistory,
            {
              date: new Date().toISOString(),
              creatinine: creatValue,
              eGFR: result.eGFR,
              stage: result.stage
            }
          ]
        });
      } catch (error) {
        console.error('Error saving data', error);
      }
    }

    // Navigate to results screen
    navigation.navigate('Result', { result });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={[styles.input, errors.age && styles.inputError]}
            keyboardType="numeric"
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            placeholder="Enter age (18-110)"
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender}
              style={styles.picker}
              onValueChange={(itemValue) => setFormData({ ...formData, gender: itemValue })}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>
        </View>

        <View style={styles.ethnicityContainer}>
          <Text style={styles.label}>Is your ethnicity Black:</Text>
          <Switch
            value={formData.isBlack}
            onValueChange={(value) => setFormData({ ...formData, isBlack: value })}
            trackColor={{ false: "#767577", true: "#0072CE" }}
            thumbColor={formData.isBlack ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>

        <Text style={styles.sectionTitle}>Blood Test Results</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Creatinine value:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputFlex, errors.creatinine && styles.inputError]}
              keyboardType="numeric"
              value={formData.creatinine}
              onChangeText={(text) => setFormData({ ...formData, creatinine: text })}
              placeholder="Enter value"
            />
            <View style={[styles.pickerContainer, styles.unitPicker]}>
              <Picker
                selectedValue={formData.creatinineUnit}
                style={styles.picker}
                onValueChange={(itemValue) => setFormData({ ...formData, creatinineUnit: itemValue })}
              >
                <Picker.Item label="μmol/L" value="micromol/l" />
                <Picker.Item label="mg/dL" value="mg/dL" />
              </Picker>
            </View>
          </View>
          {errors.creatinine && <Text style={styles.errorText}>{errors.creatinine}</Text>}
        </View>

        <Text style={styles.sectionTitle}>Save Your Information</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>NHS Number (optional):</Text>
          <TextInput
            style={[styles.input, errors.nhsNumber && styles.inputError]}
            keyboardType="numeric"
            value={formData.nhsNumber}
            onChangeText={(text) => setFormData({ ...formData, nhsNumber: text })}
            placeholder="Enter 10-digit NHS number"
            maxLength={10}
          />
          {errors.nhsNumber && <Text style={styles.errorText}>{errors.nhsNumber}</Text>}
        </View>

        <View style={[styles.formGroup, styles.rememberMeContainer]}>
          <Text style={styles.label}>Remember me:</Text>
          <Switch
            value={formData.rememberMe}
            onValueChange={(value) => setFormData({ ...formData, rememberMe: value })}
            trackColor={{ false: "#767577", true: "#0072CE" }}
            thumbColor={formData.rememberMe ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>Calculate eGFR</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: 'red',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 54,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0072CE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  disclaimer: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
    color: '#666',
  },
  ethnicityContainer: {
    borderWidth: 1,
    borderColor: '#ccc',  // Maintain your chosen theme color
    borderRadius: 8,
    padding: 5,  // Keep padding to maintain internal space
    marginBottom: 20,  // Space below the box
    flexDirection: 'row', // Set children to line up in a row
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Distribute space between children
  },
  rememberMeContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 5,
    marginBottom: 20,
    flexDirection: 'row', // Arrange label and switch in a row
    alignItems: 'center', // Align items vertically in the center
    justifyContent: 'space-between', // Add space between the label and the switch
  },
});

export default PatientCalculatorScreen;