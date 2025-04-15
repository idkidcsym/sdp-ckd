import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { UserContext } from '../userContext';

const ResultScreen = ({ route, navigation }) => {
  const { result, patientInfo } = route.params;
  const { userSession } = useContext(UserContext);

  const screenWidth = Dimensions.get('window').width;


  const getStageInfo = () => {
    const isClinic = userSession.userType === 'clinician';

    switch (result.stage) {
      case 1:
        return isClinic
          ? 'Normal kidney function but with other findings. Consider regular monitoring.'
          : 'Kidneys are functioning normally, but there might be other findings that suggest kidney disease.';
      case 2:
        return isClinic
          ? 'Mildly reduced kidney function. Monitor and assess cardiovascular risk factors.'
          : 'Kidneys have mildly reduced function. Follow-up with your doctor for monitoring.';
      case '3A':
        return isClinic
          ? 'Moderately reduced kidney function. Monitor at least every 6 months. Assess and manage CVD risk.'
          : 'Kidneys have moderately reduced function. Regular check-ups are important.';
      case '3B':
        return isClinic
          ? 'Moderately reduced kidney function. Monitor quarterly. Consider nephrology referral.'
          : 'Kidneys have moderately reduced function. More frequent monitoring is recommended.';
      case 4:
        return isClinic
          ? 'Severely reduced kidney function. Likely requires nephrology referral.'
          : 'Kidneys have severely reduced function. You should be under specialist care.';
      case 5:
        return isClinic
          ? 'Very severe reduction or kidney failure. Patient needs nephrologist care.'
          : 'Kidneys have very severe reduced function or failure. Specialist care is essential.';
      default:
        return 'No specific recommendations for this result.';
    }
  };

  const historyData = {
    labels: userSession.calculationHistory.length > 0
      ? userSession.calculationHistory.slice(-7).map((item, index) => `${index + 1}`)
      : ['1'],
    datasets: [{
      data: userSession.calculationHistory.length > 0
        ? userSession.calculationHistory.slice(-7).map(item => item.eGFR)
        : [result.eGFR],
      color: (opacity = 1) => `rgba(0, 114, 206, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 114, 206, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#0072CE'
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>eGFR Result</Text>
        <Text style={styles.resultValue}>{result.eGFR.toFixed(1)} ml/min/1.73m²</Text>

        <View style={styles.stageContainer}>
          <Text style={styles.stageLabel}>CKD Stage:</Text>
          <Text style={[styles.stageValue,
          result.stage <= 2 ? styles.stageGood :
            result.stage === '3A' || result.stage === '3B' ? styles.stageWarning :
              styles.stageCritical]}>
            {result.stage}
          </Text>
        </View>

        <Text style={styles.infoTitle}>What does this mean?</Text>
        <Text style={styles.infoText}>{getStageInfo()}</Text>
      </View>

      {userSession.calculationHistory.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>eGFR History</Text>
          <LineChart
            data={historyData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            verticalLabelRotation={0}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            yAxisLabel=""
            yAxisSuffix=""
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(userSession.userType === 'clinician' ? 'ClinicianCalculator' : 'PatientCalculator')}
      >
        <Text style={styles.buttonText}>New Calculation</Text>
      </TouchableOpacity>

      {userSession.isLoggedIn && (
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonText}>View Full History</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  resultCard: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  resultValue: {
    fontSize: 20,
    color: '#0072CE',
    marginBottom: 10,
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageLabel: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
  },
  stageValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stageGood: {
    color: 'green',
  },
  stageWarning: {
    color: 'orange',
  },
  stageCritical: {
    color: 'red',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  chartCard: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0072CE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#005EB8',
  },
});

export default ResultScreen;