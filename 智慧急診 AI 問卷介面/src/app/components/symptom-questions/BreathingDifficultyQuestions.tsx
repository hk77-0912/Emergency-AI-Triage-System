interface BreathingDifficultyQuestionsProps {
  details: any;
  onUpdate: (updates: any) => void;
}

const symptomsOptions = [
  { id: 'chest_pain', label: '胸痛' },
  { id: 'cough', label: '咳嗽' },
  { id: 'wheezing', label: '喘鳴聲' },
  { id: 'fever', label: '發燒' },
  { id: 'leg_swelling', label: '下肢水腫' },
];

export function BreathingDifficultyQuestions({ details, onUpdate }: BreathingDifficultyQuestionsProps) {
  const toggleSymptom = (symptomId: string) => {
    const current = details.breathingSymptoms || [];
    const updated = current.includes(symptomId)
      ? current.filter((s: string) => s !== symptomId)
      : [...current, symptomId];
    onUpdate({ breathingSymptoms: updated });
  };

  return (
    <div className="space-y-6 p-6 bg-cyan-50 rounded-xl border-2 border-cyan-200">
      <h3 className="font-bold text-lg text-cyan-900 flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
        呼吸困難專屬問題
      </h3>

      {/* 發作時機 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          呼吸困難的發作時機
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['活動時', '休息時', '睡覺時', '任何時候'].map((option) => (
            <button
              key={option}
              onClick={() => onUpdate({ breathingOnset: option })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.breathingOnset === option
                  ? 'bg-cyan-100 border-cyan-500 text-cyan-700 ring-2 ring-cyan-200' 
                  : 'border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 姿勢影響 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          何種姿勢較為舒適？
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['坐著', '躺著', '無差別'].map((option) => (
            <button
              key={option}
              onClick={() => onUpdate({ breathingPosition: option })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.breathingPosition === option
                  ? 'bg-cyan-100 border-cyan-500 text-cyan-700 ring-2 ring-cyan-200' 
                  : 'border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 伴隨症狀 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          是否伴隨以下症狀？（可複選）
        </label>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {symptomsOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleSymptom(option.id)}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${(details.breathingSymptoms || []).includes(option.id)
                  ? 'bg-cyan-100 border-cyan-500 text-cyan-700 ring-2 ring-cyan-200' 
                  : 'border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={details.breathingSymptomsOther || ''}
          onChange={(e) => onUpdate({ breathingSymptomsOther: e.target.value })}
          placeholder="其他伴隨症狀..."
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white"
        />
      </div>
    </div>
  );
}
