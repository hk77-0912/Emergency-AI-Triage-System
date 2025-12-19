export interface PatientInfo {
  name: string;
  gender: string;
  idNumber: string;
  birthDate: string;
  age: number;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  visitIdentity: string;
}

export interface QuestionnaireData {
  patientInfo: PatientInfo;
  chiefComplaint: string;
  chiefComplaintOther: string;
  symptomDetails: {
    startTime?: string;
    nature?: string[];
    natureOther?: string;
    severity?: number;
    
    // 頭痛專屬
    headacheStress?: string;
    headacheColdWind?: string;
    headacheNausea?: string[];
    headacheNauseaOther?: string;
    
    // 胸痛專屬
    chestPainActivity?: string;
    chestPainRadiation?: string;
    chestPainSymptoms?: string[];
    chestPainSymptomsOther?: string;
    
    // 腹痛專屬
    abdominalPainLocation?: string;
    abdominalPainLocationOther?: string;
    abdominalPainTiming?: string;
    abdominalPainSymptoms?: string[];
    abdominalPainSymptomsOther?: string;
    
    // 頭暈專屬
    dizzinessType?: string;
    dizzinessPostural?: string;
    dizzinessSymptoms?: string[];
    dizzinessSymptomsOther?: string;
    
    // 呼吸困難專屬
    breathingOnset?: string;
    breathingPosition?: string;
    breathingSymptoms?: string[];
    breathingSymptomsOther?: string;
  };
  medicalHistory: {
    chronicDiseases: string[];
    chronicDiseasesOther: string;
    pastIllnesses: string;
  };
  medicationAllergy: {
    medications: string;
    allergies: string[];
    allergiesOther: string;
  };
}
