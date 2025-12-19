import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { QuestionnaireData } from '../../types/questionnaire';
import { HeadacheQuestions } from '../symptom-questions/HeadacheQuestions';
import { ChestPainQuestions } from '../symptom-questions/ChestPainQuestions';
import { AbdominalPainQuestions } from '../symptom-questions/AbdominalPainQuestions';
import { DizzinessQuestions } from '../symptom-questions/DizzinessQuestions';
import { BreathingDifficultyQuestions } from '../symptom-questions/BreathingDifficultyQuestions';
import { GeneralSymptomQuestions } from '../symptom-questions/GeneralSymptomQuestions';

interface SymptomDetailsStepProps {
  data: QuestionnaireData;
  onNext: (data: Partial<QuestionnaireData>) => void;
  onBack: () => void;
}

export function SymptomDetailsStep({ data, onNext, onBack }: SymptomDetailsStepProps) {
  const [symptomDetails, setSymptomDetails] = useState(data.symptomDetails);

  const handleSubmit = () => {
    if (!symptomDetails.startTime || !symptomDetails.severity) {
      alert('請填寫症狀開始時間與嚴重程度');
      return;
    }
    onNext({ symptomDetails });
  };

  const updateDetails = (updates: any) => {
    setSymptomDetails({ ...symptomDetails, ...updates });
  };

  const renderSpecificQuestions = () => {
    switch (data.chiefComplaint) {
      case 'headache':
        return <HeadacheQuestions details={symptomDetails} onUpdate={updateDetails} />;
      case 'chest_pain':
        return <ChestPainQuestions details={symptomDetails} onUpdate={updateDetails} />;
      case 'abdominal_pain':
        return <AbdominalPainQuestions details={symptomDetails} onUpdate={updateDetails} />;
      case 'dizziness':
        return <DizzinessQuestions details={symptomDetails} onUpdate={updateDetails} />;
      case 'breathing_difficulty':
        return <BreathingDifficultyQuestions details={symptomDetails} onUpdate={updateDetails} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">症狀詳細資訊</h2>
        <p className="text-gray-600">請詳細描述您的症狀，以協助醫師進行初步評估</p>
      </div>

      <div className="space-y-8">
        <GeneralSymptomQuestions details={symptomDetails} onUpdate={updateDetails} />
        
        {renderSpecificQuestions()}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all"
        >
          下一步
        </button>
      </div>
    </div>
  );
}
