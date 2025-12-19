import { QuestionnaireData } from '../types/questionnaire';

// 將病患口語描述轉換為標準醫療用語
export function translateToMedicalTerms(data: QuestionnaireData) {
  // 主訴翻譯
  const chiefComplaintMap: Record<string, string> = {
    'chest_pain': '胸痛 (Chest Pain)',
    'abdominal_pain': '腹痛 (Abdominal Pain)',
    'headache': '頭痛 (Headache)',
    'dizziness': '頭暈 (Dizziness)',
    'breathing_difficulty': '呼吸困難 (Dyspnea)',
    'fever': '發燒 (Fever)',
    'other': data.chiefComplaintOther || '其他主訴',
  };

  // 慢性疾病翻譯
  const chronicDiseasesMap: Record<string, string> = {
    'hypertension': '高血壓 (HTN)',
    'diabetes': '糖尿病 (DM)',
    'heart_disease': '心臟病 (Heart Disease)',
    'asthma': '氣喘 (Asthma)',
    'kidney_disease': '腎臟病 (CKD)',
    'liver_disease': '肝臟病 (Liver Disease)',
    'cancer': '癌症 (Cancer)',
    'stroke': '中風病史 (Stroke Hx)',
  };

  // 過敏史翻譯
  const allergiesMap: Record<string, string> = {
    'penicillin': 'Penicillin',
    'aspirin': 'Aspirin (ASA)',
    'nsaids': 'NSAIDs',
    'sulfa': 'Sulfa drugs',
    'iodine': 'Iodine contrast',
    'seafood': 'Seafood',
    'none': '無已知過敏',
  };

  // 症狀性質翻譯
  const natureMap: Record<string, string> = {
    'dull': '悶痛 (Dull pain)',
    'sharp': '刺痛 (Sharp pain)',
    'throbbing': '搏動性疼痛 (Throbbing)',
    'burning': '灼熱感 (Burning)',
    'continuous': '持續性 (Continuous)',
    'intermittent': '間歇性 (Intermittent)',
  };

  // 轉換症狀性質
  const symptomNature = (data.symptomDetails.nature || [])
    .map(n => natureMap[n] || n)
    .join('、') + (data.symptomDetails.natureOther ? `、${data.symptomDetails.natureOther}` : '');

  // 根據主訴產生專屬症狀摘要
  const specificSymptoms = generateSpecificSymptomsSummary(data);

  return {
    chiefComplaint: chiefComplaintMap[data.chiefComplaint] || data.chiefComplaintOther,
    chronicDiseases: chronicDiseasesMap,
    allergies: allergiesMap,
    symptomNature: symptomNature || '未描述',
    specificSymptoms,
  };
}

function generateSpecificSymptomsSummary(data: QuestionnaireData): string[] {
  const symptoms: string[] = [];
  const { chiefComplaint, symptomDetails } = data;

  switch (chiefComplaint) {
    case 'headache':
      if (symptomDetails.headacheStress === '是') {
        symptoms.push('近期壓力大或情緒緊繃 → 考慮 Tension-type headache');
      }
      if (symptomDetails.headacheColdWind === '是') {
        symptoms.push('長時間吹冷風或熬夜 → 可能誘發因子');
      }
      if (symptomDetails.headacheNausea?.includes('nausea')) {
        symptoms.push('伴隨噁心嘔吐 → 警示症狀，需排除顱內病變');
      }
      if (symptomDetails.headacheNausea?.includes('vision_blur')) {
        symptoms.push('視力模糊 → 紅旗症狀！需緊急神經學檢查');
      }
      if (symptomDetails.headacheNausea?.includes('light_sensitivity')) {
        symptoms.push('畏光 (Photophobia) → 可能為偏頭痛或腦膜炎');
      }
      break;

    case 'chest_pain':
      if (symptomDetails.chestPainActivity === '是') {
        symptoms.push('活動後加劇 → 高度懷疑心因性胸痛 (Cardiac origin)');
      }
      if (symptomDetails.chestPainRadiation === '是') {
        symptoms.push('放射至左肩或手臂 → 典型心肌缺血表現！');
      }
      if (symptomDetails.chestPainSymptoms?.includes('breathing_difficulty')) {
        symptoms.push('伴隨呼吸困難 → 需考慮肺栓塞或心衰竭');
      }
      if (symptomDetails.chestPainSymptoms?.includes('cold_sweat')) {
        symptoms.push('冒冷汗 (Diaphoresis) → 警示症狀！高度懷疑 ACS');
      }
      break;

    case 'abdominal_pain':
      if (symptomDetails.abdominalPainLocation === 'lower_right') {
        symptoms.push('右下腹痛 → 高度懷疑急性闌尾炎，建議外科會診');
      }
      if (symptomDetails.abdominalPainLocation === 'upper_right') {
        symptoms.push('右上腹痛 → 考慮膽囊炎或肝臟問題');
      }
      if (symptomDetails.abdominalPainSymptoms?.includes('vomiting')) {
        symptoms.push('伴隨嘔吐 → 可能為腸胃炎或腸阻塞');
      }
      if (symptomDetails.abdominalPainSymptoms?.includes('blood_stool')) {
        symptoms.push('血便 → 警示症狀！需緊急評估消化道出血');
      }
      break;

    case 'dizziness':
      if (symptomDetails.dizzinessType === '天旋地轉（眩暈）') {
        symptoms.push('真性眩暈 (True vertigo) → 考慮前庭系統問題');
      }
      if (symptomDetails.dizzinessPostural === '是') {
        symptoms.push('姿勢性加重 → 考慮 BPPV 或姿勢性低血壓');
      }
      if (symptomDetails.dizzinessSymptoms?.includes('weakness')) {
        symptoms.push('肢體無力 → 紅旗症狀！需排除中風');
      }
      if (symptomDetails.dizzinessSymptoms?.includes('speech_difficulty')) {
        symptoms.push('說話困難 → 緊急！高度懷疑腦中風');
      }
      break;

    case 'breathing_difficulty':
      if (symptomDetails.breathingOnset === '活動時') {
        symptoms.push('活動性呼吸困難 → 考慮心衰竭或肺部疾病');
      }
      if (symptomDetails.breathingPosition === '坐著') {
        symptoms.push('端坐呼吸 (Orthopnea) → 高度懷疑心衰竭');
      }
      if (symptomDetails.breathingSymptoms?.includes('wheezing')) {
        symptoms.push('喘鳴聲 (Wheezing) → 考慮氣喘或 COPD 急性發作');
      }
      if (symptomDetails.breathingSymptoms?.includes('chest_pain')) {
        symptoms.push('伴隨胸痛 → 需排除肺栓塞或氣胸');
      }
      break;
  }

  return symptoms.length > 0 ? symptoms : ['無特殊警示症狀'];
}
