import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Switch, KeyboardAvoidingView, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../userContext';
import { calculateEGFR } from '../utils/ckdCalculator';

const ClinicianCalculatorScreen = ({ navigation }) => {
  const { userSession, setUserSession } = useContext(UserContext);

  const [formData, setFormData] = useState({
    patientId: '',
    age: '',
    gender: 'male',
    isBlack: false,
    creatinine: '',
    creatinineUnit: 'micromol/l',
    hcpId: ''
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.hcpId) {
      newErrors.hcpId = 'Please enter your HCP ID';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;

    let creatValue = parseFloat(formData.creatinine);
    if (formData.creatinineUnit === 'mg/dL') {
      creatValue = creatValue * 88.4;
    }

    const result = calculateEGFR(
      creatValue,
      parseInt(formData.age),
      formData.gender === 'female',
      formData.isBlack
    );

    setUserSession({
      ...userSession,
      userType: 'clinician',
      userId: formData.hcpId,
      calculationHistory: [
        ...userSession.calculationHistory,
        {
          date: new Date().toISOString(),
          patientId: formData.patientId || 'Anonymous',
          creatinine: creatValue,
          eGFR: result.eGFR,
          stage: result.stage
        }
      ]
    });

    navigation.navigate('Result', {
      result,
      patientInfo: {
        id: formData.patientId,
        age: formData.age,
        gender: formData.gender,
        isBlack: formData.isBlack
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Clinician Information</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Healthcare Professional ID:</Text>
          <TextInput
            style={[styles.input, errors.hcpId && styles.inputError]}
            value={formData.hcpId}
            onChangeText={(text) => setFormData({ ...formData, hcpId: text })}
            placeholder="Enter your HCP ID"
          />
          {errors.hcpId && <Text style={styles.errorText}>{errors.hcpId}</Text>}
        </View>

        <Text style={styles.sectionTitle}>Patient Information</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Patient ID (optional):</Text>
          <TextInput
            style={styles.input}
            value={formData.patientId}
            onChangeText={(text) => setFormData({ ...formData, patientId: text })}
            placeholder="Enter patient ID"
          />
        </View>

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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Is patient ethnicity Black:</Text>
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

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCalculate}
          >
            <Text style={styles.buttonText}>Calculate eGFR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('BatchUpload')}
          >
            <Text style={styles.buttonText}>Batch Upload</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 20,
    paddingBottom: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  picker: {
    width: '100%',
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputFlex: {
    flex: 1,
  },
  unitPicker: {
    flex: 0.3,
    marginLeft: 10,
  }
});

export default ClinicianCalculatorScreen;
