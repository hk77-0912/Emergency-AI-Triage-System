import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Stethoscope, FileText, RotateCcw, Brain, TrendingUp } from 'lucide-react';
import { QuestionnaireData } from '../../types/questionnaire';
import { analyzeSymptoms } from '../../utils/aiAnalysis';

interface ResultsStepProps {
  data: QuestionnaireData;
  onReset: () => void;
  onSwitchToDoctorView?: (data: QuestionnaireData) => void;
}

export function ResultsStep({ data, onReset, onSwitchToDoctorView }: ResultsStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    // 模擬 AI 分析過程
    setTimeout(() => {
      const analysisResults = analyzeSymptoms(data);
      setResults(analysisResults);
      setIsAnalyzing(false);
    }, 2000);
  }, [data]);

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 border border-blue-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">AI 正在分析您的症狀</h2>
          <p className="text-gray-600 mb-8">請稍候，系統正在處理您的資料並產生初步建議...</p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 免責聲明 */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 mb-2">醫療免責聲明</h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              以下結果由 AI 系統根據您提供的資訊產生，僅供<strong>臨床決策輔助參考</strong>，不能作為最終診斷依據。
              最終的診斷與治療決策將由急診專科醫師根據理學檢查、實驗室檢驗及影像學檢查等綜合評估後決定。
            </p>
          </div>
        </div>
      </div>

      {/* AI 分析結果 */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">AI 分流分析結果</h2>
              <p className="text-blue-100 text-sm">Emergency Severity Index & Recommendations</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* ESI 分級 */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className={`
                p-6 rounded-2xl text-center border-2
                ${results.esi.level <= 2 ? 'bg-red-50 border-red-300' : ''}
                ${results.esi.level === 3 ? 'bg-yellow-50 border-yellow-300' : ''}
                ${results.esi.level >= 4 ? 'bg-green-50 border-green-300' : ''}
              `}>
                <div className="text-sm text-gray-600 mb-2">ESI 緊急分級</div>
                <div className={`
                  text-5xl font-bold mb-2
                  ${results.esi.level <= 2 ? 'text-red-600' : ''}
                  ${results.esi.level === 3 ? 'text-yellow-600' : ''}
                  ${results.esi.level >= 4 ? 'text-green-600' : ''}
                `}>
                  {results.esi.level}
                </div>
                <div className="text-sm font-medium text-gray-700">{results.esi.description}</div>
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">預估等候時間</div>
                  <div className="text-sm text-gray-700">{results.esi.waitTime}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                <Stethoscope className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">建議分科</div>
                  <div className="text-sm text-gray-700">{results.department}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 鑑別診斷 */}
          <div className="border-t-2 border-gray-100 pt-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              可能的鑑別診斷 (Differential Diagnosis)
            </h3>
            <div className="space-y-3">
              {results.differentialDiagnosis.map((diagnosis: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{diagnosis.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{diagnosis.description}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {diagnosis.probability}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 建議處置 */}
          <div className="border-t-2 border-gray-100 pt-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              建議檢查與處置
            </h3>
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-5">
              <ul className="space-y-2">
                {results.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-gray-800">
                    <span className="text-cyan-600 font-bold mt-0.5">•</span>
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 資料整合說明 */}
          <div className="border-t-2 border-gray-100 pt-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">資料整合與標準</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="font-semibold text-emerald-900 mb-2">✓ EMR 電子病歷寫入</div>
                <div className="text-sm text-emerald-800">
                  結構化資料已準備寫入電子病歷系統，包含主訴、症狀時序、生命徵象評估等
                </div>
              </div>
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                <div className="font-semibold text-sky-900 mb-2">✓ FHIR 標準格式</div>
                <div className="text-sm text-sky-800">
                  支援 FHIR 資源格式（Patient, Observation, Condition, Encounter），可與其他醫療系統交換
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onReset}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          重新填寫問卷
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 border-2 border-blue-300 text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
        >
          <FileText className="w-5 h-5" />
          列印報告
        </button>
        {onSwitchToDoctorView && (
          <button
            onClick={() => onSwitchToDoctorView(data)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2"
          >
            <Stethoscope className="w-5 h-5" />
            切換至醫師端畫面
          </button>
        )}
      </div>
    </div>
  );
}
