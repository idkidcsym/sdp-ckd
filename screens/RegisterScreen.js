import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../userContext';

const RegisterScreen = ({ navigation }) => {
  const { setUserSession } = useContext(UserContext);
  const [userType, setUserType] = useState('patient');
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to validate the form
  const validateForm = () => {
    // Basic validation
    if (!fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your full name');
      return false;
    }

    if (!idNumber.trim()) {
      Alert.alert('Required Field', userType === 'patient' ? 'Please enter your NHS number' : 'Please enter your HCP ID');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Required Field', 'Please enter your email address');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    if (!password) {
      Alert.alert('Required Field', 'Please enter a password');
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return false;
    }

    // Validate NHS number format (10 digits) for patients
    if (userType === 'patient' && (!/^\d{10}$/.test(idNumber))) {
      Alert.alert('Invalid NHS Number', 'NHS number must be 10 digits');
      return false;
    }

    // Validate HCP ID format for clinicians
    if (userType === 'clinician' && !idNumber.trim()) {
      Alert.alert('Invalid HCP ID', 'Please enter a valid HCP ID');
      return false;
    }

    return true;
  };

  // Function to handle registration
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API registration with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you would send registration data to your backend
      // and receive a success response

      // Option 1: Just show success and redirect to login
      Alert.alert(
        'Registration Successful',
        'Your account has been created. You can now log in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );

      // Option 2: Auto-login after successful registration
      /*
      setUserSession({
        isLoggedIn: true,
        userType: userType,
        userId: idNumber,
        userProfile: {
          name: fullName,
          email: email,
        },
        calculationHistory: []
      });
      navigation.replace('Home');
      */

    } catch (error) {
      Alert.alert('Registration Failed', 'An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Create Your Account</Text>

          <View style={styles.formContainer}>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'patient' && styles.activeUserType
                ]}
                onPress={() => setUserType('patient')}
              >
                <Text style={userType === 'patient' ? styles.activeText : styles.inactiveText}>
                  Patient
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'clinician' && styles.activeUserType
                ]}
                onPress={() => setUserType('clinician')}
              >
                <Text style={userType === 'clinician' ? styles.activeText : styles.inactiveText}>
                  Clinician
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              autoCapitalize="words"
            />

            <Text style={styles.inputLabel}>
              {userType === 'patient' ? 'NHS Number' : 'HCP ID'}
            </Text>
            <TextInput
              style={styles.input}
              value={idNumber}
              onChangeText={setIdNumber}
              placeholder={userType === 'patient' ? 'Enter your 10-digit NHS number' : 'Enter your HCP ID'}
              keyboardType="number-pad"
              maxLength={userType === 'patient' ? 10 : 8}
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password (min. 8 characters)"
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Enter your password again"
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005eb8',
    marginBottom: 24,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#e8edee',
    borderRadius: 8,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
  },
  activeUserType: {
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  activeText: {
    color: '#005eb8',
    fontWeight: '600',
  },
  inactiveText: {
    color: '#768692',
  },
  inputLabel: {
    fontSize: 16,
    color: '#425563',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8dde0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
  },
  registerButton: {
    backgroundColor: '#005eb8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  disabledButton: {
    backgroundColor: '#768692',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#425563',
    fontSize: 14,
  },
  loginLink: {
    color: '#005eb8',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegisterScreen;