
export const calculateEGFR = (creatinine, age, isFemale, isBlack) => {
  // eGFR = 186 x (Creat / 88.4)^-1.154 x (Age)^-0.203 x (0.742 if female) x (1.210 if black)

  if (creatinine <= 0 || age < 18 || age > 110) {
    throw new Error('Invalid input values');
  }

  // Calculates eGFR 
  let eGFR = 186 * Math.pow(creatinine / 88.4, -1.154) * Math.pow(age, -0.203);

  if (isFemale) {
    eGFR *= 0.742;
  }

  if (isBlack) {
    eGFR *= 1.210;
  }

  // categories ckd based on eGFR
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
  //returns the score and stage 
  return { eGFR, stage };
};