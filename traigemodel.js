/**
 * 智慧分流基礎模型 (Triage Core Model)
 * 功能：提供各類症狀的 AI 判定邏輯，並支援醫師回饋學習
 */

const TriageModel = {
    // --- 1. 核心數據配置 (可擴充) ---
    version: "1.0.0",
    institution: "53652269", 

    // --- 2. 胸痛判斷規則庫 ---
    chestRules: [
        {
            id: "Combo_A",
            name: "組合 A｜極高風險・立即處置",
            esi: 1,
            color: "red",
            dept: "急診醫學科（立即啟動急救）",
            ddx: ["急性心肌梗塞 (STEMI)", "主動脈剝離", "大量肺栓塞", "張力性氣胸"],
            treatment: ["立即高流量氧氣", "建立雙 IV", "心電圖即時監測", "AED/ACLS 準備"],
            // 邏輯：生命徵象不穩 + (壓迫/撕裂痛/突發劇痛)
            check: (d) => d.vitalsUnstable && (d.pressurePain || d.tearingPain || d.sudden)
        },
        {
            id: "Combo_B",
            name: "組合 B｜高度疑似心因性胸痛",
            esi: 2,
            color: "orange",
            dept: "急診醫學科 / 心臟內科",
            ddx: ["急性冠心症 (NSTEMI/UA)", "心肌缺氧", "心包膜炎"],
            treatment: ["ECG (10分鐘內)", "Troponin 抽血", "心電監測", "啟動 ACS pathway"],
            // 邏輯：典型壓迫感 + (冒冷汗/噁心/病史/時間長)
            check: (d) => d.pressurePain && (d.sweating || d.nausea || d.history || d.duration20)
        },
        {
            id: "Combo_D",
            name: "組合 D｜疑似主動脈或重大血管病變",
            esi: 2,
            color: "purple",
            dept: "心臟外科 / 血管外科",
            ddx: ["主動脈剝離", "主動脈瘤破裂"],
            treatment: ["CTA (胸+腹部)", "Bedside Echo", "嚴格血壓控制", "立即外科會診"],
            // 邏輯：撕裂感 + 放射至背部 + 突發
            check: (d) => d.tearingPain && d.backPain && d.sudden
        },
        {
            id: "Combo_C",
            name: "組合 C｜疑似肺部急症",
            esi: 2,
            color: "teal",
            dept: "急診醫學科 / 胸腔內科",
            ddx: ["肺栓塞", "自發性氣胸", "肺炎合併胸膜炎"],
            treatment: ["SpO2 連續監測", "D-dimer 抽血", "胸部 X 光", "CTPA 評估"],
            // 邏輯：呼吸加劇痛 + 呼吸困難
            check: (d) => d.breathDiff && d.pleuriticPain 
        },
        {
            id: "Combo_F",
            name: "組合 F｜低風險・非心因性胸痛",
            esi: 4,
            color: "green",
            dept: "家醫科 / 一般內科",
            ddx: ["肋軟骨炎", "肌肉拉傷", "胃食道逆流", "焦慮/恐慌發作"],
            treatment: ["給予止痛藥", "衛教與返診指示", "必要時安排門診 ECG"],
            // 邏輯：局部刺痛、姿勢改變痛且無危險因子
            check: (d) => (d.stabbingPain || d.positionalPain) && !d.sweating && !d.history
        }
    ],

    // --- 3. 分析引擎 ---
    /**
     * 分析胸痛數據
     * @param {Object} input - 包含各項勾選指標的布林值
     */
    analyzeChest(input) {
        console.log("[TriageModel] 正在分析胸痛數據...", input);

        // 預設結果 (Combo E)
        let result = {
            id: "Combo_E",
            name: "組合 E｜中度風險・需檢查排除",
            esi: 3,
            color: "yellow",
            dept: "急診醫學科",
            ddx: ["非典型心絞痛", "心包膜炎", "食道痙攣"],
            treatment: ["ECG 檢查", "基本抽血", "胸部 X 光", "觀察與疼痛控制"]
        };

        // 依照規則順序匹配 (由高危險往低危險跑)
        for (const rule of this.chestRules) {
            if (rule.check(input)) {
                result = rule;
                break; // 匹配到最高優先級的組合即跳出
            }
        }

        return result;
    },

    // --- 4. 學習與同步介面 ---
    /**
     * 醫師回饋更新機制
     * @param {string} comboId - 組合 ID
     * @param {boolean} isCorrect - 醫師是否認可 AI 判斷
     */
    submitFeedback(comboId, isCorrect, doctorNote) {
        const feedback = {
            timestamp: new Date().toISOString(),
            org: this.institution,
            model: "Chest_v1",
            comboId: comboId,
            isCorrect: isCorrect,
            note: doctorNote
        };
        
        console.log("[TriageModel] 已收到醫師回饋，準備更新權重:", feedback);
        
        // 這裡未來可以對接 fetch('https://your-api.com/update-model', { method: 'POST' ... })
        return true;
    }
};

/**
 * 智慧分流基礎模型 - 腹痛模組 (Abdominal Pain Module)
 */
const AbdomenModule = {
    // --- 1. 腹痛判斷規則庫 ---
    abdomenRules: [
        {
            id: "Abd_Combo_A",
            name: "組合 A｜極高風險・疑似急腹症／敗血症",
            esi: 1,
            color: "red",
            dept: "急診醫學科 / 一般外科",
            ddx: ["腸穿孔", "腸阻塞合併缺血", "壞死性腸炎", "敗血性腹膜炎", "腹內出血"],
            treatment: ["NPO 禁食", "廣效性抗生素", "腹部 CT (STAT)", "Bedside US (FAST)", "快速輸液"],
            // 邏輯：生命徵象不穩 + (劇烈腹痛/僵硬/反彈痛)
            check: (d) => d.vitalsUnstable && (d.severePain || d.rigidAbdomen || d.reboundTenderness)
        },
        {
            id: "Abd_Combo_B",
            name: "組合 B｜高度疑似需手術腹痛",
            esi: 2,
            color: "orange",
            dept: "急診醫學科 / 一般外科",
            ddx: ["急性闌尾炎", "急性膽囊炎", "腸套疊", "腸阻塞 (早期)"],
            treatment: ["NPO 禁食", "IV 輸液", "腹部超音波", "外科會診"],
            // 邏輯：定位疼痛 (右上/右下) + 持續時間 > 6h + 發燒/嘔吐
            check: (d) => d.localizedPain && d.duration6h && (d.fever || d.vomiting)
        },
        {
            id: "Abd_Combo_E",
            name: "組合 E｜疑似婦科相關腹痛 (女性)",
            esi: 2, // 考慮子宮外孕，設為高風險
            color: "purple",
            dept: "急診醫學科 / 婦產科",
            ddx: ["子宮外孕", "卵巢扭轉", "骨盆腔發炎 (PID)", "黃體破裂"],
            treatment: ["β-hCG 檢查", "骨盆腔超音波", "立即婦產科會診"],
            // 邏輯：下腹/骨盆痛 + (女性 + 懷孕可能/月經異常)
            check: (d) => d.pelvicPain && (d.pregnantPossible || d.menstrualIrregular)
        },
        {
            id: "Abd_Combo_D",
            name: "組合 D｜疑似泌尿系統腹痛",
            esi: 3,
            color: "blue",
            dept: "急診醫學科 / 泌尿科",
            ddx: ["腎結石", "輸尿管結石", "泌尿道感染"],
            treatment: ["尿液分析", "泌尿系統 CT/US", "止痛 (NSAIDs/Opioid)"],
            // 邏輯：側腹痛/陣發性絞痛 + (血尿/排尿痛/噁心)
            check: (d) => (d.flankPain || d.colicPain) && (d.hematuria || d.dysuria)
        },
        {
            id: "Abd_Combo_C",
            name: "組合 C｜疑似感染性或發炎性腹痛",
            esi: 3,
            color: "yellow",
            dept: "急診醫學科 / 內科 / 感染科",
            ddx: ["急性腸胃炎", "感染性腸炎", "大腸憩室炎", "IBD flare"],
            treatment: ["補液治療", "糞便檢查", "抗生素評估"],
            // 邏輯：中度腹痛 + 發燒 + (腹瀉/嘔吐)
            check: (d) => d.moderatePain && d.fever && (d.diarrhea || d.vomiting)
        },
        {
            id: "Abd_Combo_F",
            name: "組合 F｜低風險・功能性或腸胃不適",
            esi: 4,
            color: "green",
            dept: "家醫科 / 一般內科 / 腸胃科",
            ddx: ["功能性消化不良", "腸躁症 (IBS)", "輕度胃炎", "飲食不適"],
            treatment: ["口服藥物 (制酸/解痙)", "飲食衛教", "返診警示"],
            // 邏輯：輕度腹痛 + 無明確定位
            check: (d) => d.mildPain && !d.localizedPain
        }
    ],

    /**
     * 分析腹痛數據
     */
    analyzeAbdomen(input) {
        console.log("[TriageModel] 正在分析腹痛數據...", input);

        // 預設結果 (預防性中度風險)
        let result = {
            id: "Abd_Combo_C",
            name: "組合 C｜疑似發炎性腹痛 (待觀察)",
            esi: 3,
            color: "yellow",
            dept: "急診醫學科",
            ddx: ["急性腸胃炎", "非特異性腹痛"],
            treatment: ["基本抽血", "症狀治療"]
        };

        for (const rule of this.abdomenRules) {
            if (rule.check(input)) {
                result = rule;
                break;
            }
        }
        return result;
    }
    /**
 * --- 5. 醫師回饋學習機制 ---
 */
};
const TriageLearning = {
    // 醫師回饋資料庫 (實務上應存於後端資料庫)
    feedbackLog: [],

    /**
     * 醫師端：提交診斷回饋
     * @param {string} patientId - 病患 ID
     * @param {string} predictedCombo - AI 預判的組合 ID (例如: Abd_Combo_C)
     * @param {string} finalDiagnosis - 醫師最終確定的診斷 (例如: 急性闌尾炎)
     * @param {number} actualEsi - 醫師實際評定的 ESI
     */
    submitDoctorFeedback(patientId, predictedCombo, finalDiagnosis, actualEsi) {
        const isMissedSurgical = (predictedCombo === 'Abd_Combo_C' && actualEsi <= 2);
        
        const feedbackEntry = {
            patientId,
            predictedCombo,
            finalDiagnosis,
            actualEsi,
            timestamp: new Date().toISOString(),
            isMatch: (actualEsi === TriageModel.getComboById(predictedCombo).esi)
        };

        this.feedbackLog.push(feedbackEntry);

        // --- 學習邏輯：自動權重優化 (模擬) ---
        if (isMissedSurgical) {
            console.warn(`🚨 [模型學習] AI 漏判了潛在手術風險！增加 "發燒" 與 "定位痛" 在腹痛模組中的權重。`);
            // 此處可實作權重數值調整
        } else if (feedbackEntry.isMatch) {
            console.log(`✅ [模型學習] AI 判定準確，鞏固現有規則。`);
        }

        return {
            status: "success",
            message: "回饋已收錄，AI 模型更新中...",
            adjustment: isMissedSurgical ? "Priority Increased" : "Stable"
        };
    },

    // 輔助函式：根據 ID 抓取組合資料
    getComboById(id) {
        return TriageModel.abdomenRules.find(r => r.id === id) || 
               TriageModel.chestRules.find(r => r.id === id);
    }
};

/**
 * 智慧分流基礎模型 - 頭痛模組 (Headache Module)
 */
const HeadacheModule = {
    // --- 1. 頭痛判斷規則庫 ---
    headacheRules: [
        {
            id: "Hd_Combo_A",
            name: "組合 A｜疑似腦出血 / 腦膜炎",
            esi: 1,
            color: "red",
            dept: "急診醫學科 / 神經內/外科",
            ddx: ["蜘蛛膜下腔出血 (SAH)", "腦內出血", "細菌性腦膜炎", "急性腦炎"],
            treatment: ["腦部 CT (STAT)", "建立 IV line", "意識與氣道保護", "廣效抗生素 (若疑感染)"],
            // 邏輯：突發劇痛 (Thunderclap) + (神經症狀 OR 發燒/頸部僵硬)
            check: (d) => d.suddenSevere && (d.neuroDeficit || d.feverStiff)
        },
        {
            id: "Hd_Combo_F",
            name: "組合 F｜外傷相關頭痛",
            esi: 2, // 視意識與症狀可能為 2-3，預設高風險
            color: "orange",
            dept: "急診醫學科 / 神經外科",
            ddx: ["腦震盪", "硬腦膜下出血 (SDH)", "顱內出血"],
            treatment: ["腦部 CT", "神經學持續評估", "監測意識變化"],
            // 邏輯：近期外傷史 + (持續頭痛 OR 神經症狀)
            check: (d) => d.recentTrauma && (d.persistentHeadache || d.neuroDeficit)
        },
        {
            id: "Hd_Combo_B",
            name: "組合 B｜疑似中樞神經急症",
            esi: 2,
            color: "orange",
            dept: "急診醫學科 / 神經內科",
            ddx: ["急性缺血性中風", "腦腫瘤/轉移", "顱內壓升高 (IICP)"],
            treatment: ["啟動 Stroke Protocol", "腦部 CT/MRI", "維持血壓/血糖穩定"],
            // 邏輯：持續加重 + (神經症狀 OR 高風險族群)
            check: (d) => d.persistentHeadache && (d.neuroDeficit || d.highRiskGroup)
        },
        {
            id: "Hd_Combo_C",
            name: "組合 C｜疑似感染或發炎",
            esi: 2, // 視情況 2-3
            color: "yellow",
            dept: "急診醫學科 / 感染科",
            ddx: ["腦膜炎", "系統性感染", "鼻竇炎併發感染"],
            treatment: ["退燒止痛", "CBC/CRP 檢查", "評估腰椎穿刺"],
            // 邏輯：持續加重 + (發燒 OR 頸部僵硬)
            check: (d) => d.persistentHeadache && d.feverStiff
        },
        {
            id: "Hd_Combo_D",
            name: "組合 D｜疑似偏頭痛",
            esi: 3,
            color: "blue",
            dept: "神經內科 / 內科",
            ddx: ["偏頭痛", "偏頭痛伴先兆", "藥物過度使用頭痛"],
            treatment: ["止痛/止吐藥", "安靜低光環境休息", "原則上不需立即影像"],
            // 邏輯：固定位置 + 畏光怕吵噁心 (排除神經症狀/發燒)
            check: (d) => d.localizedHeadache && d.migraineSymptoms && !d.neuroDeficit && !d.feverStiff
        },
        {
            id: "Hd_Combo_E",
            name: "組合 E｜疑似緊張型頭痛",
            esi: 4,
            color: "green",
            dept: "一般內科 / 門診追蹤",
            ddx: ["緊張型頭痛", "壓力相關頭痛"],
            treatment: ["口服止痛藥", "休息/補充水分", "生活壓力評估"],
            // 邏輯：持續性但非劇烈且無紅旗指標
            check: (d) => d.persistentHeadache && !d.neuroDeficit && !d.feverStiff && !d.recentTrauma
        }
    ],

    /**
     * 分析頭痛數據
     */
    analyzeHeadache(input) {
        console.log("[TriageModel] 正在分析頭痛數據...", input);
        
        // 預設結果
        let result = {
            id: "Hd_Combo_E",
            name: "組合 E｜頭痛 (性質待查)",
            esi: 4,
            color: "green",
            dept: "內科門診",
            ddx: ["緊張型頭痛", "非特異性頭痛"],
            treatment: ["症狀評估", "建議門診追蹤"]
        };

        for (const rule of this.headacheRules) {
            if (rule.check(input)) {
                result = rule;
                break;
            }
        }
        return result;
    }
};
/**
 * 智慧分流基礎模型 - 頭暈模組 (Dizzy Module)
 */
const DizzyModule = {
    // --- 1. 頭暈判斷規則庫 ---
    dizzyRules: [
        {
            id: "Dz_Combo_A",
            name: "組合 A｜極高風險・疑似中樞神經急症",
            esi: 1,
            color: "red",
            dept: "急診醫學科 / 神經內/外科",
            ddx: ["後循環中風", "腦出血", "小腦病變", "顱內壓升高"],
            treatment: ["腦部 CT (立即)", "NIHSS 評估", "氧氣/生命徵象監測", "建立 IV"],
            // 邏輯：突發持續頭暈 + (神經學警訊 OR 意識/生命徵象不穩)
            check: (d) => d.suddenPersistent && (d.neuroRedFlags || d.vitalsUnstable)
        },
        {
            id: "Dz_Combo_B",
            name: "組合 B｜高度疑似中樞性頭暈",
            esi: 2,
            color: "orange",
            dept: "急診醫學科 / 神經內科",
            ddx: ["短暫性腦缺血 (TIA)", "後循環缺血", "中樞性眩暈"],
            treatment: ["腦部 MRI/CT", "中風流程評估", "ECG", "住院觀察"],
            // 邏輯：突發持續頭暈 + (輕度神經異常 OR 高心血管風險/病史)
            check: (d) => d.suddenPersistent && (d.mildNeuro || d.cardioHistory)
        },
        {
            id: "Dz_Combo_C",
            name: "組合 C｜疑似心因性/血流動力學相關",
            esi: 2, // 視生命徵象可能為 2-3
            color: "blue",
            dept: "急診醫學科 / 心臟內科",
            ddx: ["心律不整", "姿勢性低血壓", "心因性暈厥", "瓣膜疾病"],
            treatment: ["ECG", "姿勢性血壓測量", "心電監測", "補液治療"],
            // 邏輯：快要昏倒 + (心悸/胸悶/昏厥史 OR 低血壓/心律不整)
            check: (d) => d.nearSyncope && (d.chestSymptoms || d.vitalsUnstable)
        },
        {
            id: "Dz_Combo_D",
            name: "組合 D｜周邊性眩暈 (耳源性)",
            esi: 3,
            color: "teal",
            dept: "急診醫學科 / 耳鼻喉科",
            ddx: ["BPPV (耳石症)", "前庭神經炎", "梅尼爾氏症"],
            treatment: ["Dix-Hallpike 檢查", "前庭抑制劑", "耳石復位術"],
            // 邏輯：旋轉感眩暈 + (姿勢誘發 OR 耳鳴/聽力下降)
            check: (d) => d.spinningVertigo && (d.positionalTrigger || d.earSymptoms)
        },
        {
            id: "Dz_Combo_E",
            name: "組合 E｜中度風險・需觀察頭暈",
            esi: 3,
            color: "yellow",
            dept: "急診醫學科 / 一般內科",
            ddx: ["藥物副作用", "脫水", "電解質不平衡", "貧血"],
            treatment: ["CBC/電解質/血糖", "補液治療", "藥物調整觀察"],
            // 邏輯：反覆頭暈且無紅旗指標
            check: (d) => d.recurrentDizzy && !d.neuroRedFlags && !d.vitalsUnstable
        },
        {
            id: "Dz_Combo_F",
            name: "組合 F｜低風險・功能性或短暫頭暈",
            esi: 4,
            color: "green",
            dept: "家醫科 / 一般內科",
            ddx: ["疲勞/壓力", "睡眠不足", "輕度姿勢性頭暈"],
            treatment: ["生活型態調整", "補充水分", "警示衛教"],
            // 邏輯：輕度短暫且無其他風險
            check: (d) => d.mildTransient && !d.neuroRedFlags && !d.vitalsUnstable
        }
    ],

    /**
     * 分析頭暈數據
     */
    analyzeDizzy(input) {
        console.log("[TriageModel] 正在分析頭暈數據...", input);
        
        let result = {
            id: "Dz_Combo_E",
            name: "組合 E｜頭暈 (原因待查)",
            esi: 3,
            color: "yellow",
            dept: "內科觀察",
            ddx: ["非特異性頭暈", "代謝性問題"],
            treatment: ["基礎檢查", "症狀觀察"]
        };

        for (const rule of this.dizzyRules) {
            if (rule.check(input)) {
                result = rule;
                break;
            }
        }
        return result;
    }
};

/**
 * 智慧分流基礎模型 - 呼吸困難模組 (Breath Module)
 */
const BreathModule = {
    // --- 1. 呼吸困難判斷規則庫 ---
    breathRules: [
        {
            id: "Br_ESI_1",
            name: "ESI 1｜極高風險・立即處置",
            esi: 1,
            color: "red",
            dept: "急診醫學科 (立即啟動搶救 / ICU)",
            ddx: ["張力性氣胸", "大面積肺栓塞", "急性呼吸衰竭", "嚴重氣喘持續狀態"],
            treatment: ["高流量氧氣 (NRB/HFNC)", "建立雙 IV", "氣道保護準備", "ABG / Bedside Echo"],
            // 邏輯：幾乎無法說話 OR 血氧 < 90% OR 意識改變
            check: (d) => d.cantSpeak || d.spo2Under90 || d.alteredConsciousness
        },
        {
            id: "Br_ESI_2_Combo1",
            name: "ESI 2｜高風險・心肺急症疑慮",
            esi: 2,
            color: "orange",
            dept: "急診醫學科 / 胸腔內科 / 心臟內科",
            ddx: ["肺栓塞 (PE)", "急性冠心症 (ACS)", "急性心衰竭", "氣胸"],
            treatment: ["ECG / CXR", "D-dimer / 心肌酵素", "霧化支氣管擴張劑", "氧氣 (目標 > 94%)"],
            // 邏輯：說話斷續 + (胸痛/咳血/暈厥/高風險病史)
            check: (d) => d.intermittentSpeech && (d.chestPain || d.hemoptysis || d.syncope || d.highRiskHistory)
        },
        {
            id: "Br_ESI_2_Combo2",
            name: "ESI 2｜高風險・突發性肺部急症",
            esi: 2,
            color: "orange",
            dept: "急診醫學科",
            ddx: ["突發氣胸", "肺栓塞", "急性過敏反應"],
            treatment: ["CXR / CTPA", "連續血氧監測", "類固醇評估"],
            // 邏輯：突然發作 + 無感冒症狀
            check: (d) => d.suddenOnset && !d.uriSymptoms
        },
        {
            id: "Br_ESI_3",
            name: "ESI 3｜穩定但需檢查排除",
            esi: 3,
            color: "yellow",
            dept: "胸腔內科 / 急診醫學科",
            ddx: ["肺炎", "氣喘中度發作", "COPD 惡化", "心衰竭代償期"],
            treatment: ["CXR", "CBC / CRP", "痰液培養", "抗生素評估"],
            // 邏輯：說話斷續或完整，但生命徵象目前穩定
            check: (d) => (d.intermittentSpeech || d.canSpeakFull) && d.stableVitals
        },
        {
            id: "Br_ESI_4",
            name: "ESI 4-5｜低風險・功能性或輕微症狀",
            esi: 4,
            color: "green",
            dept: "胸腔內科 / 耳鼻喉科 / 身心科", // 依細分建議
            ddx: ["過度換氣", "輕微支氣管痙攣", "感冒後喘"],
            treatment: ["呼吸指導", "Peak Flow 測量", "門診追蹤建議"],
            // 邏輯：能完整說話 + 輕微喘 + 無胸痛咳血
            check: (d) => d.canSpeakFull && d.mildDyspnea && !d.chestPain && !d.hemoptysis
        }
    ],

    /**
     * 針對 ESI 4-5 的分科細分邏輯 (根據使用者勾選特性)
     */
    getBreathSpecialty(d) {
        if (d.postURI) return "胸腔內科 (上呼吸道感染後續喘)";
        if (d.nasalSymptoms || d.throatSensation) return "耳鼻喉科 (鼻塞/喉嚨異物感相關)";
        if (d.anxietyRelated) return "身心科 (焦慮/過度換氣疑慮)";
        if (d.exerciseInduced) return "胸腔內科 (運動誘發氣喘評估)";
        return "一般內科";
    },

    /**
     * 分析呼吸困難數據
     */
    analyzeBreath(input) {
        console.log("[TriageModel] 正在分析呼吸困難數據...", input);
        
        // 預設 (中度風險)
        let result = {
            id: "Br_ESI_3",
            name: "ESI 3｜穩定但需檢查",
            esi: 3,
            color: "yellow",
            dept: "胸腔內科",
            ddx: ["呼吸道感染", "氣喘/COPD"],
            treatment: ["臨床觀察", "影像檢查"]
        };

        for (const rule of this.breathRules) {
            if (rule.check(input)) {
                result = { ...rule };
                // 針對低風險進行分科細分
                if (result.esi >= 4) {
                    result.dept = this.getBreathSpecialty(input);
                }
                break;
            }
        }
        return result;
    }
};

/**
 * 智慧分流基礎模型 - 發燒模組 (Fever Module)
 */
const FeverModule = {
    // --- 1. 發燒判斷規則庫 ---
    feverRules: [
        {
            id: "Fv_ESI_1",
            name: "ESI 1｜極高風險・疑似敗血性休克",
            esi: 1,
            color: "red",
            dept: "急診醫學科 (立即啟動搶救 / ICU)",
            ddx: ["敗血性休克", "嚴重肺炎併呼吸衰竭", "中樞神經感染 (腦膜炎)"],
            treatment: ["快速靜脈輸液", "早期廣效抗生素", "血液培養 x2", "乳酸 (Lactate) 監測"],
            // 邏輯：發燒 + (意識改變 OR 低血壓/休克 OR 嚴重呼吸困難)
            check: (d) => d.hasFever && (d.alteredConsciousness || d.hypotension || d.severeDyspnea)
        },
        {
            id: "Fv_ESI_2_RedFlag",
            name: "ESI 2｜高風險・紅旗症狀",
            esi: 2,
            color: "orange",
            dept: "急診醫學科 / 感染科",
            ddx: ["腦膜炎疑慮", "嚴重尿路感染", "深部組織感染"],
            treatment: ["退燒與補液", "住院觀察評估", "視情況執行腰椎穿刺或 CT"],
            // 邏輯：高燒 >= 39 + 任一紅旗 (頸部僵硬/呼吸困難/快昏倒)
            check: (d) => d.highFever39 && (d.stiffNeck || d.dyspnea || d.nearSyncope)
        },
        {
            id: "Fv_ESI_2_HighRisk",
            name: "ESI 2｜高風險族群發燒",
            esi: 2,
            color: "orange",
            dept: "急診醫學科 / 專科住院",
            ddx: ["新生兒發燒", "免疫低下感染", "術後感染"],
            treatment: ["全面性感染評估 (Workup)", "經驗性抗生素", "尿液/血液培養"],
            // 邏輯：發燒 + 高風險 (小於3個月/免疫低下/近期手術)
            check: (d) => d.hasFever && (d.infantUnder3M || d.immunocompromised || d.recentSurgery)
        },
        {
            id: "Fv_ESI_3",
            name: "ESI 3｜穩定但需多項資源",
            esi: 3,
            color: "yellow",
            dept: "一般內科 / 各相關專科",
            ddx: ["肺炎", "泌尿道感染 (UTI)", "急性腸胃炎", "蜂窩性組織炎"],
            treatment: ["局部症狀檢查 (CXR/UA/糞便)", "口服或靜脈抗生素", "補水治療"],
            // 邏輯：生命徵象穩定 + 局部感染症狀 + 需要多種資源
            check: (d) => d.hasFever && d.stableVitals && d.localizedSymptoms
        },
        {
            id: "Fv_ESI_4",
            name: "ESI 4-5｜低風險・病毒感染疑慮",
            esi: 4,
            color: "green",
            dept: "家醫科 / 各專科門診",
            ddx: ["普通感冒", "流感/COVID-19 輕症", "病毒性腸胃炎"],
            treatment: ["退燒止痛 (Acetaminophen)", "休息補水", "衛教回診警訊"],
            // 邏輯：低於39度 + 無紅旗 + 無高風險病史 + 活動力尚可
            check: (d) => d.feverUnder39 && !d.redFlags && !d.highRiskHistory && d.goodActivity
        }
    ],

    /**
     * 針對 ESI 4-5 的發燒分科建議
     */
    getFeverSpecialty(d) {
        if (d.soreThroat || d.runnyNose) return "耳鼻喉科 (呼吸道感染)";
        if (d.coughNotDyspnea) return "胸腔內科 (氣管炎疑慮)";
        if (d.dysuria || d.urinaryFrequency) return "泌尿科 (尿路感染評估)";
        if (d.diarrhea || d.vomiting) return "腸胃內科 (腸胃炎)";
        if (d.rash) return "皮膚科 (皮疹與感染鑑別)";
        return "家醫科 / 一般內科";
    },

    /**
     * 分析發燒數據
     */
    analyzeFever(input) {
        console.log("[TriageModel] 正在分析發燒數據...", input);
        
        let result = {
            id: "Fv_ESI_3",
            name: "ESI 3｜發燒 (待評估)",
            esi: 3,
            color: "yellow",
            dept: "一般內科",
            ddx: ["感染症待查"],
            treatment: ["基礎篩檢", "症狀治療"]
        };

        for (const rule of this.feverRules) {
            if (rule.check(input)) {
                result = { ...rule };
                if (result.esi >= 4) {
                    result.dept = this.getFeverSpecialty(input);
                }
                break;
            }
        }
        return result;
    }
};

// 合併至主物件
Object.assign(TriageModel, FeverModule);

// 合併至主物件
Object.assign(TriageModel, BreathModule);

// 合併至主物件
Object.assign(TriageModel, DizzyModule);
// 合併至主物件
Object.assign(TriageModel, HeadacheModule);
// 合併至主模型
Object.assign(TriageModel, TriageLearning);


// 將模組功能合併至主物件
Object.assign(TriageModel, AbdomenModule);



// 讓其他檔案可以存取
window.TriageModel = TriageModel;