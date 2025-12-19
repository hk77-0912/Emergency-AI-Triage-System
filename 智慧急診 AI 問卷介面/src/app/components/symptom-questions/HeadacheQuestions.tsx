interface HeadacheQuestionsProps {
  details: any;
  onUpdate: (updates: any) => void;
}

const nauseaOptions = [
  { id: 'nausea', label: '噁心嘔吐' },
  { id: 'vision_blur', label: '視力模糊' },
  { id: 'light_sensitivity', label: '畏光' },
  { id: 'sound_sensitivity', label: '怕吵' },
];

export function HeadacheQuestions({ details, onUpdate }: HeadacheQuestionsProps) {
  const toggleNausea = (optionId: string) => {
    const current = details.headacheNausea || [];
    const updated = current.includes(optionId)
      ? current.filter((n: string) => n !== optionId)
      : [...current, optionId];
    onUpdate({ headacheNausea: updated });
  };

  return (
    <div className="space-y-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
      <h3 className="font-bold text-lg text-purple-900 flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
        頭痛專屬問題
      </h3>

      {/* 壓力狀態 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          近期是否壓力過大或情緒緊繃？
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['是', '否', '不確定'].map((option) => (
            <button
              key={option}
              onClick={() => onUpdate({ headacheStress: option })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.headacheStress === option
                  ? 'bg-purple-100 border-purple-500 text-purple-700 ring-2 ring-purple-200' 
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 冷風或熬夜 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          是否長時間吹冷風或熬夜？
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['是', '否', '不確定'].map((option) => (
            <button
              key={option}
              onClick={() => onUpdate({ headacheColdWind: option })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.headacheColdWind === option
                  ? 'bg-purple-100 border-purple-500 text-purple-700 ring-2 ring-purple-200' 
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
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
          {nauseaOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleNausea(option.id)}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${(details.headacheNausea || []).includes(option.id)
                  ? 'bg-purple-100 border-purple-500 text-purple-700 ring-2 ring-purple-200' 
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={details.headacheNauseaOther || ''}
          onChange={(e) => onUpdate({ headacheNauseaOther: e.target.value })}
          placeholder="其他伴隨症狀..."
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white"
        />
      </div>
    </div>
  );
}
