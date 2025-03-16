import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../userContext';

const ProfileScreen = ({ navigation }) => {
  const { userSession, setUserSession } = useContext(UserContext);
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('patientData');
      setUserSession({
        isLoggedIn: false,
        userType: null,
        userId: null,
        userProfile: null,
        calculationHistory: []
      });
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      
      {userSession.isLoggedIn ? (
        <>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>User Type:</Text>
            <Text style={styles.infoValue}>
              {userSession.userType === 'patient' ? 'Patient' : 'Healthcare Professional'}
            </Text>
            
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={styles.infoValue}>{userSession.userId}</Text>
            
            {userSession.userProfile && (
              <>
                {userSession.userProfile.age && (
                  <>
                    <Text style={styles.infoLabel}>Age:</Text>
                    <Text style={styles.infoValue}>{userSession.userProfile.age}</Text>
                  </>
                )}
                
                {userSession.userProfile.gender && (
                  <>
                    <Text style={styles.infoLabel}>Gender:</Text>
                    <Text style={styles.infoValue}>
                      {userSession.userProfile.gender === 'female' ? 'Female' : 'Male'}
                    </Text>
                  </>
                )}
              </>
            )}
            
            <Text style={styles.infoLabel}>Calculations Stored:</Text>
            <Text style={styles.infoValue}>{userSession.calculationHistory.length}</Text>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
            <Text style={styles.buttonText}>View Calculation History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.notLoggedInText}>
            You're not currently logged in. Use the calculator and save your details to create a profile.
          </Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('UserType')}
          >
            <Text style={styles.buttonText}>Go to Calculator</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Shared Styles
const styles = StyleSheet.create({
  container: {
    flexGrow:1,
    padding: 16,
    backgroundColor: '#F5F5F5',
    minHeight: '100%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0072CE'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16
  },
  button: {
    backgroundColor: '#0072CE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8
  },
  secondaryButton: {
    backgroundColor: '#005EB8'
  },
  logoutButton: {
    backgroundColor: '#d32f2f'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  optionButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#0072CE',
    marginBottom: 4
  },
  optionDescription: {
    color: '#666'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#0072CE'
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333'
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputFlex: {
    flex: 1
  },
  inputError: {
    borderColor: '#d32f2f'
  },
  errorText: {
    color: '#d32f2f',
    marginTop: 4
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 4,
    overflow: 'hidden'
  },
  unitPicker: {
    width: 100,
    marginLeft: 8
  },
  picker: {
    height: 50,
    width: '100%'
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0072CE'
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8
  },
  stageLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  stageValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  stageGood: {
    color: '#4caf50'
  },
  stageWarning: {
    color: '#ff9800'
  },
  stageCritical: {
    color: '#f44336'
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444'
  },
  chartCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center'
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0072CE',
    alignSelf: 'flex-start'
  },
  chart: {
    marginTop: 8,
    borderRadius: 8
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 16
  },
  textArea: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666'
  },
  resultsContainer: {
    marginTop: 16
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  tableCell: {
    flex: 1,
    textAlign: 'center'
  },
  idCell: {
    flex: 2,
    textAlign: 'left'
  },
  list: {
    paddingBottom: 16
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  historyDate: {
    fontSize: 14,
    color: '#666'
  },
  patientId: {
    fontSize: 14,
    color: '#0072CE',
    fontWeight: 'bold'
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  historyValue: {
    alignItems: 'center'
  },
  historyLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  historyData: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
    fontStyle: 'italic'
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 16
  },
  stageTable: {
    marginBottom: 16
  },
  stageRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  stageCell: {
    flex: 1,
    padding: 8,
    fontSize: 14
  },
  stageHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5'
  },
  disclaimer: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 16,
    textAlign: 'center'
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16
  },
  notLoggedInContainer: {
    alignItems: 'center',
    padding: 16
  },
  notLoggedInText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    color: '#666'
  }
});

export default ProfileScreen;