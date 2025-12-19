import { useState } from 'react';
import { Heart, Droplet, Brain, Disc, Wind, Thermometer, AlertCircle } from 'lucide-react';
import { QuestionnaireData } from '../../types/questionnaire';

interface ChiefComplaintStepProps {
  data: QuestionnaireData;
  onNext: (data: Partial<QuestionnaireData>) => void;
}

const complaints = [
  { id: 'chest_pain', label: '胸痛', icon: Heart, color: 'red' },
  { id: 'abdominal_pain', label: '腹痛', icon: Droplet, color: 'amber' },
  { id: 'headache', label: '頭痛', icon: Brain, color: 'purple' },
  { id: 'dizziness', label: '頭暈', icon: Disc, color: 'blue' },
  { id: 'breathing_difficulty', label: '呼吸困難', icon: Wind, color: 'cyan' },
  { id: 'fever', label: '發燒', icon: Thermometer, color: 'orange' },
];

const colorClasses: Record<string, { bg: string; hover: string; ring: string; icon: string }> = {
  red: { bg: 'bg-red-50', hover: 'hover:bg-red-100', ring: 'ring-red-500', icon: 'text-red-600' },
  amber: { bg: 'bg-amber-50', hover: 'hover:bg-amber-100', ring: 'ring-amber-500', icon: 'text-amber-600' },
  purple: { bg: 'bg-purple-50', hover: 'hover:bg-purple-100', ring: 'ring-purple-500', icon: 'text-purple-600' },
  blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', ring: 'ring-blue-500', icon: 'text-blue-600' },
  cyan: { bg: 'bg-cyan-50', hover: 'hover:bg-cyan-100', ring: 'ring-cyan-500', icon: 'text-cyan-600' },
  orange: { bg: 'bg-orange-50', hover: 'hover:bg-orange-100', ring: 'ring-orange-500', icon: 'text-orange-600' },
};

export function ChiefComplaintStep({ data, onNext }: ChiefComplaintStepProps) {
  const [selectedComplaint, setSelectedComplaint] = useState(data.chiefComplaint);
  const [otherText, setOtherText] = useState(data.chiefComplaintOther);
  const [showOther, setShowOther] = useState(false);

  const handleSubmit = () => {
    if (!selectedComplaint && !otherText) {
      alert('請選擇主訴或填寫其他症狀');
      return;
    }
    onNext({ chiefComplaint: selectedComplaint, chiefComplaintOther: otherText });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">請選擇您的主要症狀</h2>
        <p className="text-gray-600">請選擇最主要或最困擾您的症狀</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {complaints.map((complaint) => {
          const Icon = complaint.icon;
          const colors = colorClasses[complaint.color];
          const isSelected = selectedComplaint === complaint.id;

          return (
            <button
              key={complaint.id}
              onClick={() => {
                setSelectedComplaint(complaint.id);
                setShowOther(false);
              }}
              className={`
                p-6 rounded-xl border-2 transition-all text-left
                ${isSelected 
                  ? `${colors.bg} border-${complaint.color}-500 ring-2 ${colors.ring}` 
                  : `border-gray-200 ${colors.hover} hover:border-${complaint.color}-300`
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <span className="font-semibold text-lg text-gray-900">{complaint.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-8">
        <button
          onClick={() => {
            setShowOther(!showOther);
            if (!showOther) setSelectedComplaint('other');
          }}
          className={`
            w-full p-4 rounded-xl border-2 transition-all text-left
            ${selectedComplaint === 'other' 
              ? 'bg-gray-50 border-gray-400 ring-2 ring-gray-400' 
              : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">其他症狀（請填寫）</span>
          </div>
        </button>

        {showOther && (
          <div className="mt-4">
            <textarea
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="請詳細描述您的症狀..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              rows={3}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
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
