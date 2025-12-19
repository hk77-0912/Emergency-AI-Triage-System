interface GeneralSymptomQuestionsProps {
  details: any;
  onUpdate: (updates: any) => void;
}

const natureOptions = [
  { id: 'dull', label: '悶痛' },
  { id: 'sharp', label: '刺痛' },
  { id: 'throbbing', label: '抽痛/搏動性' },
  { id: 'burning', label: '灼熱感' },
  { id: 'continuous', label: '持續性' },
  { id: 'intermittent', label: '間歇性' },
];

export function GeneralSymptomQuestions({ details, onUpdate }: GeneralSymptomQuestionsProps) {
  const toggleNature = (natureId: string) => {
    const currentNatures = details.nature || [];
    const newNatures = currentNatures.includes(natureId)
      ? currentNatures.filter((n: string) => n !== natureId)
      : [...currentNatures, natureId];
    onUpdate({ nature: newNatures });
  };

  return (
    <>
      {/* 症狀開始時間 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          症狀開始時間 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['30分鐘內', '1-3 小時', '3-24 小時', '超過 24 小時'].map((time) => (
            <button
              key={time}
              onClick={() => onUpdate({ startTime: time })}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${details.startTime === time 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* 症狀性質 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          症狀性質（可複選）
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
          {natureOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleNature(option.id)}
              className={`
                p-3 rounded-xl border-2 transition-all font-medium
                ${(details.nature || []).includes(option.id)
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={details.natureOther || ''}
          onChange={(e) => onUpdate({ natureOther: e.target.value })}
          placeholder="其他性質描述..."
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
      </div>

      {/* 症狀嚴重程度 */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3">
          症狀嚴重程度（0-10 分）<span className="text-red-500">*</span>
        </label>
        <div className="bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 p-6 rounded-xl border-2 border-gray-200">
          <input
            type="range"
            min="0"
            max="10"
            value={details.severity || 5}
            onChange={(e) => onUpdate({ severity: parseInt(e.target.value) })}
            className="w-full h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #fbbf24 50%, #ef4444 100%)`,
            }}
          />
          <div className="flex justify-between mt-3">
            <span className="text-sm text-gray-600">無痛</span>
            <span className="text-2xl font-bold text-blue-700">{details.severity || 5} 分</span>
            <span className="text-sm text-gray-600">劇痛</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          0 = 完全不痛，5 = 中等疼痛，10 = 難以忍受的劇痛
        </p>
      </div>
    </>
  );
}
