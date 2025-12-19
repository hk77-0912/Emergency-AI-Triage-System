import { QuestionnaireData } from '../types/questionnaire';

// AI 分析邏輯（模擬 NLP 與臨床決策支援系統）
export function analyzeSymptoms(data: QuestionnaireData) {
  const { chiefComplaint, symptomDetails, medicalHistory } = data;

  // 根據主訴決定分析結果
  switch (chiefComplaint) {
    case 'chest_pain':
      return analyzeChestPain(symptomDetails, medicalHistory);
    case 'headache':
      return analyzeHeadache(symptomDetails, medicalHistory);
    case 'abdominal_pain':
      return analyzeAbdominalPain(symptomDetails, medicalHistory);
    case 'dizziness':
      return analyzeDizziness(symptomDetails, medicalHistory);
    case 'breathing_difficulty':
      return analyzeBreathingDifficulty(symptomDetails, medicalHistory);
    default:
      return getDefaultAnalysis(symptomDetails);
  }
}

function analyzeChestPain(symptomDetails: any, medicalHistory: any) {
  const severity = symptomDetails.severity || 5;
  const hasCardiacRisk = medicalHistory.chronicDiseases.some((d: string) => 
    ['hypertension', 'diabetes', 'heart_disease'].includes(d)
  );
  const hasRadiation = symptomDetails.chestPainRadiation === '是';
  const hasSweating = (symptomDetails.chestPainSymptoms || []).includes('cold_sweat');

  // 高風險評估
  const isHighRisk = (severity >= 7) || (hasCardiacRisk && hasRadiation) || hasSweating;

  return {
    esi: {
      level: isHighRisk ? 2 : 3,
      description: isHighRisk ? '緊急' : '急迫',
      waitTime: isHighRisk ? '立即處理（< 10 分鐘）' : '約 10-30 分鐘',
    },
    department: '急診內科 / 心臟科',
    differentialDiagnosis: [
      {
        name: '急性冠心症候群 (ACS)',
        description: '包含心肌梗塞或不穩定心絞痛，需立即心電圖與心肌酶檢查',
        probability: '高度可能',
      },
      {
        name: '主動脈剝離',
        description: '嚴重且危及生命，需緊急影像學檢查',
        probability: '中度可能',
      },
      {
        name: '肺栓塞',
        description: '需評估 D-dimer 與肺部影像',
        probability: '中度可能',
      },
      {
        name: '胃食道逆流或肌肉骨骼疼痛',
        description: '較為良性的原因，但需排除危險病因',
        probability: '低度可能',
      },
    ],
    recommendations: [
      '立即執行 12 導程心電圖 (ECG)',
      '抽血檢驗：Troponin I/T、CK-MB、D-dimer',
      '胸部 X 光檢查',
      '持續心電監測與生命徵象監測',
      '若心電圖異常或 Troponin 升高，啟動心導管團隊',
      '考慮給予阿斯匹靈與硝化甘油（排除禁忌症）',
    ],
  };
}

function analyzeHeadache(symptomDetails: any, medicalHistory: any) {
  const severity = symptomDetails.severity || 5;
  const hasNeurologySymptoms = (symptomDetails.headacheNausea || []).includes('vision_blur');
  const suddenOnset = symptomDetails.startTime === '30分鐘內';

  const isHighRisk = (severity >= 8 && suddenOnset) || hasNeurologySymptoms;

  return {
    esi: {
      level: isHighRisk ? 2 : 3,
      description: isHighRisk ? '緊急' : '急迫',
      waitTime: isHighRisk ? '立即處理（< 10 分鐘）' : '約 20-40 分鐘',
    },
    department: '急診內科 / 神經科',
    differentialDiagnosis: [
      {
        name: '偏頭痛',
        description: '搏動性頭痛，常伴隨噁心、畏光',
        probability: '高度可能',
      },
      {
        name: '張力型頭痛',
        description: '壓力或肌肉緊繃引起，雙側悶痛',
        probability: '高度可能',
      },
      {
        name: '叢集性頭痛',
        description: '單側劇烈疼痛，伴隨流淚或鼻塞',
        probability: '中度可能',
      },
      {
        name: '顱內出血或腦瘤（需排除）',
        description: '若有神經學症狀或突發劇痛，需緊急影像檢查',
        probability: '低度可能（但需排除）',
      },
    ],
    recommendations: [
      '詳細神經學檢查（意識、瞳孔、肌力）',
      '若有紅旗症狀，執行腦部電腦斷層 (CT)',
      '考慮給予止痛藥物（NSAIDs 或 Acetaminophen）',
      '評估是否需要腰椎穿刺排除腦膜炎',
      '建議神經內科門診追蹤',
    ],
  };
}

function analyzeAbdominalPain(symptomDetails: any, medicalHistory: any) {
  const severity = symptomDetails.severity || 5;
  const location = symptomDetails.abdominalPainLocation;
  const hasVomiting = (symptomDetails.abdominalPainSymptoms || []).includes('vomiting');

  const isHighRisk = (severity >= 7) || location === 'lower_right' || hasVomiting;

  return {
    esi: {
      level: isHighRisk ? 2 : 3,
      description: isHighRisk ? '緊急' : '急迫',
      waitTime: isHighRisk ? '立即處理（< 15 分鐘）' : '約 20-40 分鐘',
    },
    department: '急診外科 / 腸胃科',
    differentialDiagnosis: [
      {
        name: '急性闌尾炎',
        description: '右下腹痛為典型表現，可能需手術',
        probability: location === 'lower_right' ? '高度可能' : '低度可能',
      },
      {
        name: '急性胃炎或消化性潰瘍',
        description: '上腹痛，與飲食相關',
        probability: '中度可能',
      },
      {
        name: '腸胃炎',
        description: '伴隨腹瀉、嘔吐',
        probability: '中度可能',
      },
      {
        name: '膽囊炎或膽結石',
        description: '右上腹痛，飯後加劇',
        probability: location === 'upper_right' ? '中度可能' : '低度可能',
      },
    ],
    recommendations: [
      '腹部理學檢查（壓痛、反彈痛、腸音）',
      '抽血檢驗：CBC、CRP、肝腎功能、澱粉酶',
      '腹部 X 光或超音波檢查',
      '若懷疑闌尾炎，考慮腹部電腦斷層',
      '禁食，建立靜脈輸液',
      '外科會診評估是否需手術',
    ],
  };
}

function analyzeDizziness(symptomDetails: any, medicalHistory: any) {
  const hasStroke = medicalHistory.chronicDiseases.includes('stroke');
  const hasWeakness = (symptomDetails.dizzinessSymptoms || []).includes('weakness');
  const isVertigo = symptomDetails.dizzinessType === '天旋地轉（眩暈）';

  const isHighRisk = hasStroke || hasWeakness;

  return {
    esi: {
      level: isHighRisk ? 2 : 3,
      description: isHighRisk ? '緊急' : '急迫',
      waitTime: isHighRisk ? '立即處理（< 15 分鐘）' : '約 30-60 分鐘',
    },
    department: '急診內科 / 神經科 / 耳鼻喉科',
    differentialDiagnosis: [
      {
        name: '良性陣發性姿勢性眩暈 (BPPV)',
        description: '姿勢改變引發的短暫眩暈',
        probability: isVertigo ? '高度可能' : '中度可能',
      },
      {
        name: '前庭神經炎',
        description: '持續性眩暈，無聽力變化',
        probability: '中度可能',
      },
      {
        name: '梅尼爾氏症',
        description: '眩暈伴隨耳鳴與聽力下降',
        probability: '中度可能',
      },
      {
        name: '中風或小腦病變（需排除）',
        description: '若有神經學症狀，需緊急影像檢查',
        probability: hasWeakness ? '中度可能' : '低度可能',
      },
    ],
    recommendations: [
      '詳細神經學檢查與平衡測試',
      '測量姿勢性血壓變化',
      '若有神經學症狀，執行腦部電腦斷層或 MRI',
      '考慮前庭功能測試',
      '症狀治療：止暈藥物（如 Betahistine）',
      '若為 BPPV，可執行耳石復位術',
    ],
  };
}

function analyzeBreathingDifficulty(symptomDetails: any, medicalHistory: any) {
  const hasHeartDisease = medicalHistory.chronicDiseases.includes('heart_disease');
  const hasChestPain = (symptomDetails.breathingSymptoms || []).includes('chest_pain');
  const severity = symptomDetails.severity || 5;

  const isHighRisk = (severity >= 7) || hasChestPain || hasHeartDisease;

  return {
    esi: {
      level: isHighRisk ? 1 : 2,
      description: isHighRisk ? '危急' : '緊急',
      waitTime: '立即處理（< 5 分鐘）',
    },
    department: '急診內科 / 心臟科 / 胸腔科',
    differentialDiagnosis: [
      {
        name: '急性肺水腫',
        description: '心衰竭引起，需緊急處理',
        probability: hasHeartDisease ? '高度可能' : '中度可能',
      },
      {
        name: '肺栓塞',
        description: '危及生命，需立即抗凝治療',
        probability: '中度可能',
      },
      {
        name: '氣喘急性發作',
        description: '呼氣性喘鳴，需支氣管擴張劑',
        probability: '中度可能',
      },
      {
        name: '氣胸',
        description: '單側呼吸音減弱，需胸部 X 光確認',
        probability: '中度可能',
      },
    ],
    recommendations: [
      '立即給予高濃度氧氣治療',
      '監測血氧飽和度與生命徵象',
      '執行動脈血液氣體分析 (ABG)',
      '胸部 X 光檢查',
      '心電圖檢查',
      '若為氣喘，給予支氣管擴張劑與類固醇',
      '若懷疑肺栓塞，檢測 D-dimer 並考慮 CT 肺動脈攝影',
    ],
  };
}

function getDefaultAnalysis(symptomDetails: any) {
  const severity = symptomDetails.severity || 5;

  return {
    esi: {
      level: severity >= 7 ? 3 : 4,
      description: severity >= 7 ? '急迫' : '次急迫',
      waitTime: severity >= 7 ? '約 30-60 分鐘' : '約 1-2 小時',
    },
    department: '急診內科',
    differentialDiagnosis: [
      {
        name: '一般內科疾病',
        description: '需進一步評估與檢查',
        probability: '待評估',
      },
    ],
    recommendations: [
      '詳細病史詢問與理學檢查',
      '視症狀安排適當的實驗室檢驗',
      '必要時會診相關專科',
    ],
  };
}
