//App.js - Main entry point for the CKD Calculator App

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './screens/HomeScreen';
import UserTypeScreen from './screens/UserTypeScreen';
import PatientCalculatorScreen from './screens/PatientCalculatorScreen';
import ClinicianCalculatorScreen from './screens/ClinicianCalculatorScreen';
import ResultScreen from './screens/ResultScreen';
import BatchUploadScreen from './screens/BatchUploadScreen';
import HistoryScreen from './screens/HistoryScreen';
import InfoScreen from './screens/InfoScreen';
import ProfileScreen from './screens/ProfileScreen';

// Create context for user session
export const UserContext = React.createContext();

const Stack = createStackNavigator();

export default function App() {
  const [userSession, setUserSession] = useState({
    isLoggedIn: false,
    userType: null, // 'patient' or 'clinician'
    userId: null,   // NHS number or HCP ID
    userProfile: null,
    calculationHistory: []
  });

  return (
    <SafeAreaProvider>
      <UserContext.Provider value={{ userSession, setUserSession }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" 
            screenOptions={{
              headerStyle: {
                backgroundColor: '#0072CE', // NHS Blue
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'CKD Calculator' }} />
            <Stack.Screen name="UserType" component={UserTypeScreen} options={{ title: 'Select User Type' }} />
            <Stack.Screen name="PatientCalculator" component={PatientCalculatorScreen} options={{ title: 'eGFR Calculator' }} />
            <Stack.Screen name="ClinicianCalculator" component={ClinicianCalculatorScreen} options={{ title: 'Clinical eGFR Calculator' }} />
            <Stack.Screen name="BatchUpload" component={BatchUploadScreen} options={{ title: 'Batch Calculate' }} />
            <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'CKD Assessment' }} />
            <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Calculation History' }} />
            <Stack.Screen name="Info" component={InfoScreen} options={{ title: 'CKD Information' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'User Profile' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserContext.Provider>
    </SafeAreaProvider>
  );
}