import { useState } from 'react';
import { User, Phone, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { PatientInfo } from '../types/questionnaire';

interface PatientInfoFormProps {
  patientInfo: PatientInfo;
  onUpdate: (info: PatientInfo) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isCompleted: boolean;
}

export function PatientInfoForm({ 
  patientInfo, 
  onUpdate, 
  isCollapsed, 
  onToggleCollapse,
  isCompleted 
}: PatientInfoFormProps) {
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleBirthDateChange = (birthDate: string) => {
    const age = calculateAge(birthDate);
    onUpdate({ ...patientInfo, birthDate, age });
  };

  // 摺疊模式顯示
  if (isCollapsed && isCompleted) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 border border-blue-100">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-between hover:bg-blue-50 transition-colors rounded-xl p-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">
                {patientInfo.name} · {patientInfo.age} 歲 · {patientInfo.gender}
              </div>
              <div className="text-sm text-gray-600">
                病歷號：{patientInfo.idNumber} | 聯絡電話：{patientInfo.phone}
              </div>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    );
  }

  // 展開模式
  return (
    <div className="bg-white rounded-2xl shadow-md border border-blue-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">病患基本資料</h3>
              <p className="text-sm text-gray-600">Patient Information</p>
            </div>
          </div>
          {isCompleted && (
            <button
              onClick={onToggleCollapse}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronUp className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* 姓名 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={patientInfo.name}
              onChange={(e) => onUpdate({ ...patientInfo, name: e.target.value })}
              placeholder="請輸入姓名"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          {/* 性別 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              性別 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['男', '女', '其他'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => onUpdate({ ...patientInfo, gender })}
                  className={`
                    p-3 rounded-xl border-2 transition-all font-medium
                    ${patientInfo.gender === gender
                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* 身分證字號 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              身分證字號 / 醫療識別碼 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={patientInfo.idNumber}
              onChange={(e) => onUpdate({ ...patientInfo, idNumber: e.target.value.toUpperCase() })}
              placeholder="例如：A123456789"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          {/* 出生年月日 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              出生年月日 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={patientInfo.birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
                className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          {/* 年齡（自動計算） */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              年齡
            </label>
            <div className="p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium">
              {patientInfo.age > 0 ? `${patientInfo.age} 歲` : '請填寫出生年月日'}
            </div>
          </div>

          {/* 聯絡電話 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              聯絡電話 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={patientInfo.phone}
                onChange={(e) => onUpdate({ ...patientInfo, phone: e.target.value })}
                placeholder="例如：0912345678"
                className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          {/* 緊急聯絡人姓名 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              緊急聯絡人姓名 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={patientInfo.emergencyContactName}
                onChange={(e) => onUpdate({ ...patientInfo, emergencyContactName: e.target.value })}
                placeholder="緊急聯絡人姓名"
                className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          {/* 緊急聯絡人電話 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              緊急聯絡人電話 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={patientInfo.emergencyContactPhone}
                onChange={(e) => onUpdate({ ...patientInfo, emergencyContactPhone: e.target.value })}
                placeholder="緊急聯絡人電話"
                className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          {/* 就診身分別 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              就診身分別 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['本人', '家屬代填', '看護代填', '其他'].map((identity) => (
                <button
                  key={identity}
                  onClick={() => onUpdate({ ...patientInfo, visitIdentity: identity })}
                  className={`
                    p-3 rounded-xl border-2 transition-all font-medium
                    ${patientInfo.visitIdentity === identity
                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  {identity}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            <strong>隱私保護說明：</strong>您的個人資料將依據個資法及醫療法規定妥善保管，僅用於醫療服務與病歷建立，並支援 FHIR Patient Resource 標準格式。
          </p>
        </div>
      </div>
    </div>
  );
}
