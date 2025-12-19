import { useState } from 'react';
import { ArrowLeft, Heart, Droplet, Activity } from 'lucide-react';
import { QuestionnaireData } from '../../types/questionnaire';

interface MedicalHistoryStepProps {
  data: QuestionnaireData;
  onNext: (data: Partial<QuestionnaireData>) => void;
  onBack: () => void;
}

const chronicDiseaseOptions = [
  { id: 'hypertension', label: '高血壓' },
  { id: 'diabetes', label: '糖尿病' },
  { id: 'heart_disease', label: '心臟病' },
  { id: 'asthma', label: '氣喘' },
  { id: 'kidney_disease', label: '腎臟病' },
  { id: 'liver_disease', label: '肝臟病' },
  { id: 'cancer', label: '癌症' },
  { id: 'stroke', label: '中風' },
];

export function MedicalHistoryStep({ data, onNext, onBack }: MedicalHistoryStepProps) {
  const [medicalHistory, setMedicalHistory] = useState(data.medicalHistory);

  const toggleDisease = (diseaseId: string) => {
    const current = medicalHistory.chronicDiseases;
    const updated = current.includes(diseaseId)
      ? current.filter((d) => d !== diseaseId)
      : [...current, diseaseId];
    setMedicalHistory({ ...medicalHistory, chronicDiseases: updated });
  };

  const handleSubmit = () => {
    onNext({ medicalHistory });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">既往病史</h2>
        <p className="text-gray-600">請告訴我們您過去的健康狀況</p>
      </div>

      <div className="space-y-8">
        {/* 慢性疾病 */}
        <div>
          <label className="block font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            是否有以下慢性疾病？（可複選）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {chronicDiseaseOptions.map((disease) => (
              <button
                key={disease.id}
                onClick={() => toggleDisease(disease.id)}
                className={`
                  p-3 rounded-xl border-2 transition-all font-medium
                  ${medicalHistory.chronicDiseases.includes(disease.id)
                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
              >
                {disease.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={medicalHistory.chronicDiseasesOther}
            onChange={(e) =>
              setMedicalHistory({ ...medicalHistory, chronicDiseasesOther: e.target.value })
            }
            placeholder="其他慢性疾病..."
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>

        {/* 過去重大疾病或手術史 */}
        <div>
          <label className="block font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            過去重大疾病或手術史
          </label>
          <textarea
            value={medicalHistory.pastIllnesses}
            onChange={(e) =>
              setMedicalHistory({ ...medicalHistory, pastIllnesses: e.target.value })
            }
            placeholder="例如：2020 年因盲腸炎手術、曾有心肌梗塞病史..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-2">若無，可略過此欄位</p>
        </div>
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
