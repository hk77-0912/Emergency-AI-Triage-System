import { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Activity, 
  AlertTriangle, 
  Brain, 
  CheckCircle, 
  FileCheck, 
  Stethoscope,
  TrendingUp,
  Clock,
  Heart,
  Pill,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Database
} from 'lucide-react';
import { QuestionnaireData } from '../types/questionnaire';
import { analyzeSymptoms } from '../utils/aiAnalysis';
import { translateToMedicalTerms } from '../utils/medicalTranslation';

interface DoctorViewProps {
  patientData: QuestionnaireData;
  onBackToPatient: () => void;
}

export function DoctorView({ patientData, onBackToPatient }: DoctorViewProps) {
  const [results, setResults] = useState<any>(null);
  const [translatedData, setTranslatedData] = useState<any>(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isQuestionnaireExpanded, setIsQuestionnaireExpanded] = useState(true);
  const [confirmedESI, setConfirmedESI] = useState<number | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');

  useEffect(() => {
    const analysisResults = analyzeSymptoms(patientData);
    const translated = translateToMedicalTerms(patientData);
    setResults(analysisResults);
    setTranslatedData(translated);
    setConfirmedESI(analysisResults.esi.level);
  }, [patientData]);

  if (!results || !translatedData) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center">載入中...</div>
      </div>
    );
  }

  const handleConfirmESI = () => {
    alert(`已確認 ESI 分級：${confirmedESI} 級\n系統將寫入電子病歷系統`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* 醫師端標題 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">醫師端 AI 輔助快速檢視系統</h1>
              <p className="text-purple-100">Doctor's AI-Assisted Triage Dashboard</p>
            </div>
          </div>
          <button
            onClick={onBackToPatient}
            className="px-4 py-2 bg-white/20 backdrop-blur hover:bg-white/30 text-white rounded-xl transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            返回病患端
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 左側欄：病患資訊與病史 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 病患基本資料 */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="font-bold text-lg">病患基本資料</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">姓名</span>
                <span className="font-semibold">{patientData.patientInfo.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">年齡 / 性別</span>
                <span className="font-semibold">{patientData.patientInfo.age} 歲 / {patientData.patientInfo.gender}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">病歷號</span>
                <span className="font-mono text-sm">{patientData.patientInfo.idNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">就診時間</span>
                <span className="text-sm">{new Date().toLocaleString('zh-TW')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">聯絡電話</span>
                <span className="text-sm">{patientData.patientInfo.phone}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">緊急聯絡人</span>
                <span className="text-sm">{patientData.patientInfo.emergencyContactName}</span>
              </div>
            </div>

            {/* 生命徵象區（模擬） */}
            <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
              <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                生命徵象（待測量）
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>BP: --- / ---</div>
                <div>HR: ---</div>
                <div>RR: ---</div>
                <div>SpO₂: ---%</div>
              </div>
            </div>
          </div>

          {/* 就醫與病史摘要 */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <button
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="w-full flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="font-bold text-lg">既往病史與用藥</h2>
              </div>
              {isHistoryExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {isHistoryExpanded && (
              <div className="space-y-4">
                {/* 慢性疾病 */}
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">慢性疾病</div>
                  <div className="flex flex-wrap gap-2">
                    {patientData.medicalHistory.chronicDiseases.length > 0 ? (
                      patientData.medicalHistory.chronicDiseases.map((disease) => (
                        <span key={disease} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          {translatedData.chronicDiseases[disease] || disease}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">無</span>
                    )}
                    {patientData.medicalHistory.chronicDiseasesOther && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        {patientData.medicalHistory.chronicDiseasesOther}
                      </span>
                    )}
                  </div>
                </div>

                {/* 過去疾病史 */}
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">過去疾病或手術史</div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {patientData.medicalHistory.pastIllnesses || '無特殊病史'}
                  </div>
                </div>

                {/* 長期用藥 */}
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    長期用藥
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {patientData.medicationAllergy.medications || '無'}
                  </div>
                </div>

                {/* 過敏史 */}
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    過敏史
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {patientData.medicationAllergy.allergies.length > 0 ? (
                      patientData.medicationAllergy.allergies.map((allergy) => (
                        <span key={allergy} className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
                          ⚠️ {translatedData.allergies[allergy] || allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">無已知過敏</span>
                    )}
                    {patientData.medicationAllergy.allergiesOther && (
                      <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
                        ⚠️ {patientData.medicationAllergy.allergiesOther}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右側欄：AI 分析與臨床建議 */}
        <div className="lg:col-span-2 space-y-6">
          {/* ESI 分級與風險評估 */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="font-bold text-lg">AI 分級與風險評估</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className={`
                p-4 rounded-xl border-2 text-center
                ${results.esi.level <= 2 ? 'bg-red-50 border-red-300' : ''}
                ${results.esi.level === 3 ? 'bg-yellow-50 border-yellow-300' : ''}
                ${results.esi.level >= 4 ? 'bg-green-50 border-green-300' : ''}
              `}>
                <div className="text-sm text-gray-600 mb-1">AI 預測 ESI</div>
                <div className={`
                  text-4xl font-bold mb-1
                  ${results.esi.level <= 2 ? 'text-red-600' : ''}
                  ${results.esi.level === 3 ? 'text-yellow-600' : ''}
                  ${results.esi.level >= 4 ? 'text-green-600' : ''}
                `}>
                  {results.esi.level}
                </div>
                <div className="text-xs text-gray-700">{results.esi.description}</div>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">建議分科</div>
                <div className="text-lg font-bold text-blue-700 mb-1">{results.department}</div>
              </div>

              <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  預估等候
                </div>
                <div className="text-sm font-semibold text-purple-700">{results.esi.waitTime}</div>
              </div>
            </div>

            {/* 醫師確認區 */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                醫師確認 / 調整 ESI 分級
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setConfirmedESI(level)}
                    className={`
                      flex-1 py-2 rounded-lg font-bold transition-all
                      ${confirmedESI === level
                        ? level <= 2 
                          ? 'bg-red-600 text-white ring-2 ring-red-300'
                          : level === 3
                          ? 'bg-yellow-600 text-white ring-2 ring-yellow-300'
                          : 'bg-green-600 text-white ring-2 ring-green-300'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI 表單轉譯結果 */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <button
              onClick={() => setIsQuestionnaireExpanded(!isQuestionnaireExpanded)}
              className="w-full flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-cyan-600" />
                </div>
                <h2 className="font-bold text-lg">AI 問卷轉譯與症狀摘要</h2>
              </div>
              {isQuestionnaireExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {isQuestionnaireExpanded && (
              <div className="space-y-4">
                {/* 主訴 */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">主訴 (Chief Complaint)</div>
                      <div className="font-bold text-lg text-gray-900">{translatedData.chiefComplaint}</div>
                      {patientData.chiefComplaintOther && (
                        <div className="text-sm text-gray-600 mt-1">病患描述：{patientData.chiefComplaintOther}</div>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-semibold">
                      AI 轉譯
                    </span>
                  </div>
                </div>

                {/* 症狀細節 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm font-semibold text-gray-700 mb-2">症狀開始時間</div>
                    <div className="text-gray-900">{patientData.symptomDetails.startTime}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm font-semibold text-gray-700 mb-2">疼痛指數</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-gray-900">{patientData.symptomDetails.severity}</div>
                      <div className="text-sm text-gray-600">/ 10 分</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm font-semibold text-gray-700 mb-2">症狀性質</div>
                  <div className="text-gray-900">{translatedData.symptomNature}</div>
                </div>

                {/* 專屬追問結果 */}
                {translatedData.specificSymptoms && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      重點追問結果（需醫師再確認）
                    </div>
                    <div className="text-sm text-gray-800 space-y-1">
                      {translatedData.specificSymptoms.map((symptom: string, index: number) => (
                        <div key={index}>• {symptom}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI 輔助臨床建議 */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="font-bold text-lg">AI 輔助臨床建議</h2>
              <span className="ml-auto px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-semibold">
                需醫師確認
              </span>
            </div>

            {/* 鑑別診斷 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">可能鑑別診斷 (DDx)</h3>
              <div className="space-y-2">
                {results.differentialDiagnosis.map((diagnosis: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-md flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{diagnosis.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{diagnosis.description}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                        {diagnosis.probability}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 建議處置 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">建議檢查與處置</h3>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <ul className="space-y-2">
                  {results.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 醫師操作區 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-md border-2 border-indigo-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-bold text-lg">醫師操作區</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  醫師備註
                </label>
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="輸入理學檢查發現、初步診斷、處置計畫..."
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <button
                  onClick={handleConfirmESI}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  確認並寫入 EMR
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
                >
                  <Database className="w-5 h-5" />
                  同步至 FHIR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
