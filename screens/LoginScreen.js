import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../userContext'; // Import the UserContext

const LoginScreen = ({ navigation }) => {
  const { userSession, setUserSession } = useContext(UserContext); // Use the UserContext
  const [userType, setUserType] = useState('patient'); // 'patient' or 'clinician'
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to handle user login
  const handleLogin = async () => {
    // Validate input fields
    if (!idNumber.trim()) {
      Alert.alert('Required Field', userType === 'patient' ? 'Please enter your NHS number' : 'Please enter your HCP ID');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Required Field', 'Please enter your password');
      return;
    }

    // In a real app, you would validate credentials against a backend
    setLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user type and id if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem('userType', userType);
        await AsyncStorage.setItem('idNumber', idNumber);
      } else {
        // Clear any stored values if not remembering
        await AsyncStorage.removeItem('userType');
        await AsyncStorage.removeItem('idNumber');
      }
      
      // Set user session in context
      setUserSession({
        isLoggedIn: true,
        userType: userType,
        userId: idNumber,
        userProfile: {
          // Mock profile data - in a real app this would come from your backend
          name: userType === 'patient' ? 'John Patient' : 'Dr. Jane Smith',
          email: userType === 'patient' ? 'patient@example.com' : 'doctor@nhs.uk',
        },
        calculationHistory: [] // Initialize with empty history
      });
      
      // Navigate to Home screen
      navigation.replace('Home');
      
    } catch (error) {
      Alert.alert('Login Failed', 'An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check for stored credentials on component mount
  React.useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
        const storedUserType = await AsyncStorage.getItem('userType');
        const storedIdNumber = await AsyncStorage.getItem('idNumber');
        
        if (storedUserType && storedIdNumber) {
          setUserType(storedUserType);
          setIdNumber(storedIdNumber);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error retrieving stored credentials:', error);
      }
    };
    
    checkStoredCredentials();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/nhs-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>CKD Risk Calculator</Text>
            <Text style={styles.subtitle}>
              Login to access your personal calculator
            </Text>
          </View>
          
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
            
            <Text style={styles.inputLabel}>
              {userType === 'patient' ? 'NHS Number' : 'HCP ID'}
            </Text>
            <TextInput
              style={styles.input}
              value={idNumber}
              onChangeText={setIdNumber}
              placeholder={userType === 'patient' ? 'Enter your NHS number' : 'Enter your HCP ID'}
              keyboardType="number-pad"
              maxLength={userType === 'patient' ? 10 : 8}
              autoCapitalize="none"
            />
            
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
            />
            
            <View style={styles.rememberMeContainer}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.guestButton}
              onPress={() => {
                // Set guest user session
                setUserSession({
                  isLoggedIn: false,
                  userType: 'guest',
                  userId: null,
                  userProfile: null,
                  calculationHistory: []
                });
                navigation.replace('Home');
              }}
            >
              <Text style={styles.guestButtonText}>
                Continue as Guest
              </Text>
            </TouchableOpacity>
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
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005eb8', // NHS blue
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#425563', // NHS dark gray
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingHorizontal: 24,
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
  rememberMeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#005eb8',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#005eb8',
  },
  checkmark: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  rememberMeText: {
    color: '#425563',
    fontSize: 14,
  },
  forgotPassword: {
    color: '#005eb8',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#005eb8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#768692',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  registerText: {
    color: '#425563',
    fontSize: 14,
  },
  registerLink: {
    color: '#005eb8',
    fontSize: 14,
    fontWeight: '500',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#005eb8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#005eb8',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoginScreen;