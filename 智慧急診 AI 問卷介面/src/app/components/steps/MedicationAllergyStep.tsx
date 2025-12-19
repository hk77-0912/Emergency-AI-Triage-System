import { useState } from 'react';
import { ArrowLeft, Pill, AlertTriangle } from 'lucide-react';
import { QuestionnaireData } from '../../types/questionnaire';

interface MedicationAllergyStepProps {
  data: QuestionnaireData;
  onNext: (data: Partial<QuestionnaireData>) => void;
  onBack: () => void;
}

const allergyOptions = [
  { id: 'penicillin', label: '盤尼西林' },
  { id: 'aspirin', label: '阿斯匹靈' },
  { id: 'nsaids', label: '消炎止痛藥' },
  { id: 'sulfa', label: '磺胺類藥物' },
  { id: 'iodine', label: '含碘顯影劑' },
  { id: 'seafood', label: '海鮮' },
  { id: 'none', label: '無過敏' },
];

export function MedicationAllergyStep({ data, onNext, onBack }: MedicationAllergyStepProps) {
  const [medicationAllergy, setMedicationAllergy] = useState(data.medicationAllergy);

  const toggleAllergy = (allergyId: string) => {
    let current = medicationAllergy.allergies;
    
    // 如果選擇「無過敏」，清空其他選項
    if (allergyId === 'none') {
      current = current.includes('none') ? [] : ['none'];
    } else {
      // 如果選擇其他選項，移除「無過敏」
      current = current.filter((a) => a !== 'none');
      current = current.includes(allergyId)
        ? current.filter((a) => a !== allergyId)
        : [...current, allergyId];
    }
    
    setMedicationAllergy({ ...medicationAllergy, allergies: current });
  };

  const handleSubmit = () => {
    onNext({ medicationAllergy });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">用藥與過敏史</h2>
        <p className="text-gray-600">請提供您的用藥資訊與過敏史，以確保用藥安全</p>
      </div>

      <div className="space-y-8">
        {/* 目前用藥 */}
        <div>
          <label className="block font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-500" />
            目前長期服用的藥物
          </label>
          <textarea
            value={medicationAllergy.medications}
            onChange={(e) =>
              setMedicationAllergy({ ...medicationAllergy, medications: e.target.value })
            }
            placeholder="例如：降血壓藥（脈優錠）、降血糖藥（庫魯化錠）、抗凝血藥（可邁丁）..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-2">若無，可略過此欄位</p>
        </div>

        {/* 過敏史 */}
        <div>
          <label className="block font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            藥物或食物過敏史（可複選）
          </label>
          
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>過敏史對於急診用藥安全非常重要，請務必詳實填寫。若不確定藥物名稱，請描述過敏反應（如：皮膚紅疹、呼吸困難等）</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            {allergyOptions.map((allergy) => {
              const isSelected = medicationAllergy.allergies.includes(allergy.id);
              const isNone = allergy.id === 'none';
              
              return (
                <button
                  key={allergy.id}
                  onClick={() => toggleAllergy(allergy.id)}
                  className={`
                    p-3 rounded-xl border-2 transition-all font-medium
                    ${isSelected
                      ? isNone 
                        ? 'bg-green-50 border-green-500 text-green-700 ring-2 ring-green-200'
                        : 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-200'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  {allergy.label}
                </button>
              );
            })}
          </div>
          
          <input
            type="text"
            value={medicationAllergy.allergiesOther}
            onChange={(e) =>
              setMedicationAllergy({ ...medicationAllergy, allergiesOther: e.target.value })
            }
            placeholder="其他過敏（藥物或食物）..."
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
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
          送出問卷
        </button>
      </div>
    </div>
  );
}
