interface AbdominalPainQuestionsProps {
  details: any;
  onUpdate: (updates: any) => void;
}

const locationOptions = [
  { id: 'upper_right', label: '右上腹' },
  { id: 'upper_middle', label: '上腹部中央' },
  { id: 'upper_left', label: '左上腹' },
  { id: 'lower_right', label: '右下腹' },
  { id: 'lower_middle', label: '下腹部中央' },
  { id: 'lower_left', label: '左下腹' },
];

const symptomsOptions = [
  { id: 'vomiting', label: '嘔吐' },
  { id: 'diarrhea', label: '腹瀉' },
  { id: 'constipation', label: '便秘' },
  { id: 'bloating', label: '腹脹' },
  { id: 'blood_stool', label: '血便' },
];

export function AbdominalPainQuestions({ details, onUpdate }: AbdominalPainQuestionsProps) {
  const toggleSymptom = (symptomId: string) => {
    const current = details.abdominalPainSymptoms || [];
    const updated = current.includes(symptomId)
      ? current.filter((s: string) => s !== symptomId)
      : [...current, symptomId];
    onUpdate({ abdominalPainSymptoms: updated });
  };

  return (
    <div className="space-y-6 p-6 bg-amber-50 rounded-xl border-2 border-amber-200">
      <h3 className="font-bold text-lg text-amber-900 flex items-center gap-2">
        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
        腹痛專屬問題
      </h3>

      {/* 疼痛位置 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          疼痛主要位置
        </label>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {locationOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onUpdate({ abdominalPainLocation: option.id })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.abdominalPainLocation === option.id
                  ? 'bg-amber-100 border-amber-500 text-amber-700 ring-2 ring-amber-200' 
                  : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={details.abdominalPainLocationOther || ''}
          onChange={(e) => onUpdate({ abdominalPainLocationOther: e.target.value })}
          placeholder="其他位置描述..."
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
        />
      </div>

      {/* 與進食關係 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          疼痛與進食的關係
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['飯前痛', '飯後痛', '無關'].map((option) => (
            <button
              key={option}
              onClick={() => onUpdate({ abdominalPainTiming: option })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.abdominalPainTiming === option
                  ? 'bg-amber-100 border-amber-500 text-amber-700 ring-2 ring-amber-200' 
                  : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50'
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
                ${(details.abdominalPainSymptoms || []).includes(option.id)
                  ? 'bg-amber-100 border-amber-500 text-amber-700 ring-2 ring-amber-200' 
                  : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={details.abdominalPainSymptomsOther || ''}
          onChange={(e) => onUpdate({ abdominalPainSymptomsOther: e.target.value })}
          placeholder="其他伴隨症狀..."
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
        />
      </div>
    </div>
  );
}
