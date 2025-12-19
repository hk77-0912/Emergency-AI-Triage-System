interface ChestPainQuestionsProps {
  details: any;
  onUpdate: (updates: any) => void;
}

const symptomsOptions = [
  { id: 'breathing_difficulty', label: '呼吸困難' },
  { id: 'cold_sweat', label: '冒冷汗' },
  { id: 'palpitations', label: '心悸' },
  { id: 'nausea', label: '噁心' },
];

export function ChestPainQuestions({ details, onUpdate }: ChestPainQuestionsProps) {
  const toggleSymptom = (symptomId: string) => {
    const current = details.chestPainSymptoms || [];
    const updated = current.includes(symptomId)
      ? current.filter((s: string) => s !== symptomId)
      : [...current, symptomId];
    onUpdate({ chestPainSymptoms: updated });
  };

  return (
    <div className="space-y-6 p-6 bg-red-50 rounded-xl border-2 border-red-200">
      <h3 className="font-bold text-lg text-red-900 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        胸痛專屬問題
      </h3>

      {/* 活動後加劇 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          胸痛是否在活動後加劇？
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['是', '否', '不確定'].map((option) => (
            <button
              key={option}
              onClick={() => onUpdate({ chestPainActivity: option })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.chestPainActivity === option
                  ? 'bg-red-100 border-red-500 text-red-700 ring-2 ring-red-200' 
                  : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 疼痛放射 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          疼痛是否放射至左肩或手臂？
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['是', '否', '不確定'].map((option) => (
            <button
              key={option}
              onClick={() => onUpdate({ chestPainRadiation: option })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.chestPainRadiation === option
                  ? 'bg-red-100 border-red-500 text-red-700 ring-2 ring-red-200' 
                  : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50'
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
                ${(details.chestPainSymptoms || []).includes(option.id)
                  ? 'bg-red-100 border-red-500 text-red-700 ring-2 ring-red-200' 
                  : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={details.chestPainSymptomsOther || ''}
          onChange={(e) => onUpdate({ chestPainSymptomsOther: e.target.value })}
          placeholder="其他伴隨症狀..."
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white"
        />
      </div>
    </div>
  );
}
