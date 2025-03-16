// screens/InfoScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const InfoScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is Chronic Kidney Disease (CKD)?</Text>
        <Text style={styles.paragraph}>
          Chronic Kidney Disease (CKD) is a long-term condition in which the kidneys do not function properly, 
          leading to impaired functionality. Various conditions can cause CKD. Most of the time, CKD does not 
          produce symptoms and may remain undetectable until it has reached an advanced stage.
        </Text>
        <Text style={styles.paragraph}>
          Additionally, CKD may not necessarily progress to kidney failure. However, patients at any stage of CKD 
          face an increased risk of developing cardiovascular diseases, such as heart disease or stroke.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Measuring Kidney Function</Text>
        <Text style={styles.paragraph}>
          The level of creatinine in the blood is a useful guide to kidney function, but GFR (glomerular 
          filtration rate) is a more accurate measure. Blood creatinine can be used to estimate GFR (eGFR) 
          using age, sex, and ethnicity.
        </Text>
        <Text style={styles.paragraph}>
          Normal GFR is approximately 100ml/min/1.73m². This calculator uses the abbreviated MDRD equation:
        </Text>
        <Text style={styles.formula}>
          eGFR = 186 x (Creat / 88.4)^-1.154^ x (Age)^-0.203^ x (0.742 if female) x (1.210 if black ethnicity)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CKD Stages</Text>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>Stage</Text>
          <Text style={styles.valueCell}>eGFR Value</Text>
          <Text style={styles.descCell}>Description</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>Stage 1</Text>
          <Text style={styles.valueCell}>&gt; 90</Text>
          <Text style={styles.descCell}>Normal kidney function but urine findings or structural abnormalities or genetic trait point to kidney disease</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>Stage 2</Text>
          <Text style={styles.valueCell}>60-89</Text>
          <Text style={styles.descCell}>Mildly reduced kidney function, and other findings point to kidney disease</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>Stage 3A</Text>
          <Text style={styles.valueCell}>45-59</Text>
          <Text style={styles.descCell}>Moderately reduced kidney function</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>Stage 3B</Text>
          <Text style={styles.valueCell}>30-44</Text>
          <Text style={styles.descCell}>Moderately reduced kidney function</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>Stage 4</Text>
          <Text style={styles.valueCell}>15-29</Text>
          <Text style={styles.descCell}>Severely reduced kidney function</Text>
        </View>
        
        <View style={styles.stageRow}>
          <Text style={styles.stageCell}>Stage 5</Text>
          <Text style={styles.valueCell}>&lt;15</Text>
          <Text style={styles.descCell}>Very severe, or end stage kidney failure</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Managing CKD</Text>
        <Text style={styles.paragraph}>
          The NHS expects clinicians to identify people with CKD and control their blood pressure. Death among 
          CKD patients is predominantly caused by cardiovascular diseases. Both the prevalence and incidence of 
          cardiovascular disease are higher in patients with CKD.
        </Text>
        <Text style={styles.paragraph}>
          Most experts recommend a target blood pressure of 130/80 mmHg for people with CKD. However, studies have shown 
          that achieving this target can be challenging, particularly in individuals over 65 years of age and those 
          with diabetes.
        </Text>
        <Text style={styles.paragraph}>
          Cigarette smoking is associated with poor outcomes in CKD, with 31% of attributable risk linked to smoking.
        </Text>
        <Text style={styles.paragraph}>
          Earlier identification of CKD in primary care, improved management of cardiovascular risk factors, 
          avoiding medications that impair renal function, addressing prostate disease in men, and timely specialist 
          referrals may improve long-term outcomes.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072CE', // NHS Blue
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    color: '#333',
  },
  formula: {
    fontStyle: 'italic',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
    textAlign: 'center',
  },
  stageRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  stageCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  valueCell: {
    flex: 1,
    textAlign: 'center',
  },
  descCell: {
    flex: 3,
  },
  button: {
    backgroundColor: '#0072CE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InfoScreen;