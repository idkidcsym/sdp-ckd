
import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { UserContext } from '../userContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  const { userSession, setUserSession } = useContext(UserContext);

  const handleLogout = () => {
    setUserSession({
      isLoggedIn: false,
      userType: null,
      userId: null,
      userProfile: null,
      calculationHistory: []
    });
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.dashboardContainer}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.dashboardLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>NephroCalc</Text>
        </View>

        <View style={styles.userInfoContainer}>
          {userSession.userType === 'guest' ? (
            <Text style={styles.welcomeText}>Welcome, Guest</Text>
          ) : (
            <Text style={styles.welcomeText}>
              Welcome, {userSession.userType === 'patient' ? 'Patient' : 'Clinician'} {userSession.userProfile?.name || userSession.userId}
            </Text>
          )}
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              if (userSession.userType === 'clinician') {
                navigation.navigate('ClinicianCalculator');
              } else {
                navigation.navigate('PatientCalculator');
              }
            }}
          >
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>📊</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Calculate eGFR</Text>
              <Text style={styles.cardDescription}>
                Estimate your Glomerular Filtration Rate using the MDRD equation
              </Text>
            </View>
          </TouchableOpacity>


          {userSession.userType === 'clinician' && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('BatchUpload')}
            >
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>📁</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Batch Calculate</Text>
                <Text style={styles.cardDescription}>
                  Upload a CSV file with patient data for bulk calculations
                </Text>
              </View>
            </TouchableOpacity>
          )}


          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Info')}
          >
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>ℹ️</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>CKD Information</Text>
              <Text style={styles.cardDescription}>
                Learn about Chronic Kidney Disease, stages, and management
              </Text>
            </View>
          </TouchableOpacity>

          {userSession.isLoggedIn && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('History')}
            >
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>📝</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Calculation History</Text>
                <Text style={styles.cardDescription}>
                  View your previous eGFR calculations and results
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {userSession.isLoggedIn && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>👤</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Your Profile</Text>
                <Text style={styles.cardDescription}>
                  Manage your account settings and personal information
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {userSession.isLoggedIn ? (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        ) : userSession.userType === 'guest' ? (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Sign In / Register</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
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
    color: '#0072CE',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#0072CE',
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
    backgroundColor: '#005EB8',
  },
  tertiaryButton: {
    backgroundColor: '#41B6E6',
  },

  // New styles for dashboard
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
    backgroundColor: '#fff',
  },
  dashboardLogo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  userInfoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  welcomeText: {
    fontSize: 16,
    color: '#425563',
  },
  cardContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8edee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIconText: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0072CE',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#425563',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#0072CE',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;