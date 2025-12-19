import { useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { PatientInfoForm } from './PatientInfoForm';
import { ChiefComplaintStep } from './steps/ChiefComplaintStep';
import { SymptomDetailsStep } from './steps/SymptomDetailsStep';
import { MedicalHistoryStep } from './steps/MedicalHistoryStep';
import { MedicationAllergyStep } from './steps/MedicationAllergyStep';
import { ResultsStep } from './steps/ResultsStep';
import { QuestionnaireData } from '../types/questionnaire';

interface QuestionnaireFlowProps {
  onReset: () => void;
  onSwitchToDoctorView?: (data: QuestionnaireData) => void;
}

const steps = [
  { id: 1, name: '主訴選擇' },
  { id: 2, name: '症狀細節' },
  { id: 3, name: '既往病史' },
  { id: 4, name: '用藥過敏' },
  { id: 5, name: 'AI 分析結果' },
];

export function QuestionnaireFlow({ onReset, onSwitchToDoctorView }: QuestionnaireFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPatientInfoCollapsed, setIsPatientInfoCollapsed] = useState(false);
  const [data, setData] = useState<QuestionnaireData>({
    patientInfo: {
      name: '',
      gender: '',
      idNumber: '',
      birthDate: '',
      age: 0,
      phone: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      visitIdentity: '',
    },
    chiefComplaint: '',
    chiefComplaintOther: '',
    symptomDetails: {},
    medicalHistory: {
      chronicDiseases: [],
      chronicDiseasesOther: '',
      pastIllnesses: '',
    },
    medicationAllergy: {
      medications: '',
      allergies: [],
      allergiesOther: '',
    },
  });

  const isPatientInfoComplete = () => {
    const { patientInfo } = data;
    return (
      patientInfo.name &&
      patientInfo.gender &&
      patientInfo.idNumber &&
      patientInfo.birthDate &&
      patientInfo.phone &&
      patientInfo.emergencyContactName &&
      patientInfo.emergencyContactPhone &&
      patientInfo.visitIdentity
    );
  };

  // 當病患資料完成後，自動收合表單
  const handlePatientInfoUpdate = (patientInfo: any) => {
    setData({ ...data, patientInfo });
    if (
      patientInfo.name &&
      patientInfo.gender &&
      patientInfo.idNumber &&
      patientInfo.birthDate &&
      patientInfo.phone &&
      patientInfo.emergencyContactName &&
      patientInfo.emergencyContactPhone &&
      patientInfo.visitIdentity
    ) {
      setTimeout(() => setIsPatientInfoCollapsed(true), 500);
    }
  };

  const handleNext = (stepData: any) => {
    setData({ ...data, ...stepData });
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 病患基本資料表單 */}
      <PatientInfoForm
        patientInfo={data.patientInfo}
        onUpdate={handlePatientInfoUpdate}
        isCollapsed={isPatientInfoCollapsed}
        onToggleCollapse={() => setIsPatientInfoCollapsed(!isPatientInfoCollapsed)}
        isCompleted={isPatientInfoComplete()}
      />

      {/* 只有在病患資料完成後才顯示進度條和問卷 */}
      {isPatientInfoComplete() && (
        <>
          {isPatientInfoCollapsed && currentStep === 1 && (
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
              <p className="text-green-800 font-medium">
                ✓ 病患基本資料已完成，請繼續填寫問卷
              </p>
            </div>
          )}
          
          <div className="mt-6">
            <ProgressBar steps={steps} currentStep={currentStep} />
          </div>

          <div className="mt-8">
            {currentStep === 1 && (
              <ChiefComplaintStep
                data={data}
                onNext={handleNext}
              />
            )}

            {currentStep === 2 && (
              <SymptomDetailsStep
                data={data}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <MedicalHistoryStep
                data={data}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <MedicationAllergyStep
                data={data}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 5 && (
              <ResultsStep
                data={data}
                onReset={onReset}
                onSwitchToDoctorView={onSwitchToDoctorView}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
