interface DizzinessQuestionsProps {
  details: any;
  onUpdate: (updates: any) => void;
}

const symptomsOptions = [
  { id: 'vertigo', label: '天旋地轉' },
  { id: 'nausea', label: '噁心嘔吐' },
  { id: 'hearing_loss', label: '耳鳴或聽力下降' },
  { id: 'weakness', label: '肢體無力' },
  { id: 'speech_difficulty', label: '說話困難' },
];

export function DizzinessQuestions({ details, onUpdate }: DizzinessQuestionsProps) {
  const toggleSymptom = (symptomId: string) => {
    const current = details.dizzinessSymptoms || [];
    const updated = current.includes(symptomId)
      ? current.filter((s: string) => s !== symptomId)
      : [...current, symptomId];
    onUpdate({ dizzinessSymptoms: updated });
  };

  return (
    <div className="space-y-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
      <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        頭暈專屬問題
      </h3>

      {/* 頭暈類型 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          頭暈的感覺是
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['天旋地轉（眩暈）', '頭重腳輕', '快暈倒的感覺', '其他'].map((option) => (
            <button
              key={option}
              onClick={() => onUpdate({ dizzinessType: option })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.dizzinessType === option
                  ? 'bg-blue-100 border-blue-500 text-blue-700 ring-2 ring-blue-200' 
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 姿勢改變 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          站起來時症狀是否加重？
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['是', '否', '不確定'].map((option) => (
            <button
              key={option}
              onClick={() => onUpdate({ dizzinessPostural: option })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.dizzinessPostural === option
                  ? 'bg-blue-100 border-blue-500 text-blue-700 ring-2 ring-blue-200' 
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
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
                ${(details.dizzinessSymptoms || []).includes(option.id)
                  ? 'bg-blue-100 border-blue-500 text-blue-700 ring-2 ring-blue-200' 
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={details.dizzinessSymptomsOther || ''}
          onChange={(e) => onUpdate({ dizzinessSymptomsOther: e.target.value })}
          placeholder="其他伴隨症狀..."
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
        />
      </div>
    </div>
  );
}
