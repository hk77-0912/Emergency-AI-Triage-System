import {
  ArrowRight,
  Shield,
  Sparkles,
  Clock,
} from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-blue-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            歡迎使用智慧急診 AI 分流系統
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            本系統將透過動態問卷蒐集您的症狀資訊，並提供初步的分流建議
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-4">
              <Sparkles className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              AI 智慧分析
            </h3>
            <p className="text-sm text-gray-600">
              根據您的症狀動態調整問題，提供精準建議
            </p>
          </div>

          <div className="text-center p-6 bg-cyan-50 rounded-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-cyan-100 rounded-xl mb-4">
              <Clock className="w-7 h-7 text-cyan-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              快速分流
            </h3>
            <p className="text-sm text-gray-600">
              約 3-5 分鐘完成問卷，加速急診處理流程
            </p>
          </div>

          <div className="text-center p-6 bg-emerald-50 rounded-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-xl mb-4">
              <Shield className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              資料保護
            </h3>
            <p className="text-sm text-gray-600">
              符合醫療隱私標準，資料安全有保障
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            重要提醒
          </h4>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>
              • 本系統提供之建議僅供
              <strong>臨床決策輔助參考</strong>
              ，不能取代專業醫師的診斷
            </li>
            <li>• 最終診斷與治療決策仍由急診醫師進行</li>
            <li>
              •
              若有生命危險徵象（如嚴重胸痛、呼吸困難、意識不清），請立即告知醫護人員
            </li>
            <li>• 請誠實填寫問卷內容，以確保分流準確性</li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            開始填寫問卷
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}