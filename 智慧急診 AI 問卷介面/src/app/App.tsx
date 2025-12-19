import { useState } from 'react';
import { QuestionnaireFlow } from './components/QuestionnaireFlow';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DoctorView } from './components/DoctorView';
import { Activity, Stethoscope } from 'lucide-react';
import { QuestionnaireData } from './types/questionnaire';

type ViewMode = 'welcome' | 'patient' | 'doctor';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [patientData, setPatientData] = useState<QuestionnaireData | null>(null);

  const handleSwitchToDoctorView = (data: QuestionnaireData) => {
    setPatientData(data);
    setViewMode('doctor');
  };

  const handleBackToPatient = () => {
    setViewMode('patient');
  };

  const handleReset = () => {
    setViewMode('welcome');
    setPatientData(null);
  };

  return (
    <div className={`min-h-screen ${viewMode === 'doctor' ? 'bg-gradient-to-br from-purple-50 via-white to-indigo-50' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'}`}>
      <header className={`${viewMode === 'doctor' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-white/80 backdrop-blur-md'} border-b ${viewMode === 'doctor' ? 'border-purple-300' : 'border-blue-100'} shadow-sm sticky top-0 z-50`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${viewMode === 'doctor' ? 'bg-white/20 backdrop-blur' : 'bg-gradient-to-br from-blue-600 to-cyan-600'} rounded-xl flex items-center justify-center shadow-md`}>
              {viewMode === 'doctor' ? (
                <Stethoscope className="w-6 h-6 text-white" />
              ) : (
                <Activity className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className={`font-bold text-xl ${viewMode === 'doctor' ? 'text-white' : 'text-gray-900'}`}>
                智慧急診 AI 分流系統 {viewMode === 'doctor' && '- 醫師端'}
              </h1>
              <p className={`text-sm ${viewMode === 'doctor' ? 'text-purple-100' : 'text-gray-600'}`}>
                Emergency AI Triage System {viewMode === 'doctor' && '- Doctor Dashboard'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {viewMode === 'welcome' && (
          <WelcomeScreen onStart={() => setViewMode('patient')} />
        )}
        
        {viewMode === 'patient' && (
          <QuestionnaireFlow 
            onReset={handleReset}
            onSwitchToDoctorView={handleSwitchToDoctorView}
          />
        )}

        {viewMode === 'doctor' && patientData && (
          <DoctorView 
            patientData={patientData}
            onBackToPatient={handleBackToPatient}
          />
        )}
      </main>

      <footer className={`mt-16 py-6 ${viewMode === 'doctor' ? 'bg-purple-100/50' : 'bg-white/50'} border-t ${viewMode === 'doctor' ? 'border-purple-200' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2025 智慧急診 AI 分流系統 - 僅供臨床決策輔助使用</p>
        </div>
      </footer>
    </div>
  );
}
