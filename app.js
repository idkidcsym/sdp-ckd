import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './userContext';

import LoginScreen from './screens/LoginScreen'; 
import HomeScreen from './screens/HomeScreen';
import UserTypeScreen from './screens/UserTypeScreen';
import PatientCalculatorScreen from './screens/PatientCalculatorScreen';
import ClinicianCalculatorScreen from './screens/ClinicianCalculatorScreen';
import ResultScreen from './screens/ResultScreen';
import BatchUploadScreen from './screens/BatchUploadScreen';
import HistoryScreen from './screens/HistoryScreen';
import InfoScreen from './screens/InfoScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login" 
            screenOptions={{
              headerStyle: {
                backgroundColor: '#0072CE', 
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ 
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ 
                title: 'Create Account',
                headerShown: true
              }} 
            />
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
      </UserProvider>
    </SafeAreaProvider>
  );
}