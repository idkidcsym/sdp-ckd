/* Calculates estimated Glomerular Filtration Rate (eGFR) using the MDRD equation
 * 
 * @param {number} creatinine - Creatinine value in micromol/l
 * @param {number} age - Age in years (must be between 18-110)
 * @param {boolean} isFemale - Whether the patient is female
 * @param {boolean} isBlack - Whether the patient is of black ethnicity
 * @returns {Object} Object containing eGFR value and CKD stage
 */
export const calculateEGFR = (creatinine, age, isFemale, isBlack) => {
  // MDRD equation:
  // eGFR = 186 x (Creat / 88.4)^-1.154 x (Age)^-0.203 x (0.742 if female) x (1.210 if black)
  
  // Validate inputs
  if (creatinine <= 0 || age < 18 || age > 110) {
    throw new Error('Invalid input values');
  }
  
  // Calculate eGFR using the MDRD equation
  let eGFR = 186 * Math.pow(creatinine / 88.4, -1.154) * Math.pow(age, -0.203);
  
  // Apply gender factor
  if (isFemale) {
    eGFR *= 0.742;
  }
  
  // Apply ethnicity factor
  if (isBlack) {
    eGFR *= 1.210;
  }
  
  // Determine CKD stage based on eGFR value
  let stage;
  if (eGFR >= 90) {
    stage = 1;
  } else if (eGFR >= 60) {
    stage = 2;
  } else if (eGFR >= 45) {
    stage = '3A';
  } else if (eGFR >= 30) {
    stage = '3B';
  } else if (eGFR >= 15) {
    stage = 4;
  } else {
    stage = 5;
  }
  
  return { eGFR, stage };
};