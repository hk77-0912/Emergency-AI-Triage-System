// 重新整理候診名單
async function refreshWaitingList() {
    const tbody = document.getElementById('waitingListBody');
    tbody.innerHTML = '<tr><td colspan="5" class="py-20 text-center text-slate-400">正在同步機構 [53652269] 候診名單...</td></tr>';

    try {
        const orgId = "53652269";
        const url = `https://hapi.fhir.org/baseR4/Condition?_sort=-_lastUpdated&_count=15&patient.organization=${orgId}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data.entry || data.entry.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="py-20 text-center text-slate-400">目前本機構暫無候診病患</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        data.entry.forEach(entry => {
            const resource = entry.resource;
            const fhirPatientId = resource.subject.reference.split('/')[1];

            // --- 核心修正：ESI 解析邏輯同步 ---
            let esiLevel = "3"; // 預設值
            const noteText = resource.note?.[0]?.text || "";
            
            if (noteText.includes("ESI_LEVEL:")) {
                // 優先從 note 標籤讀取 (例如 ESI_LEVEL:2)
                esiLevel = noteText.split("ESI_LEVEL:")[1].substring(0, 1);
            } else {
                // 保險換算：避免直接顯示 8/10 這種數字
                const rawSev = parseInt(resource.severity?.text) || 5;
                esiLevel = rawSev >= 9 ? "2" : (rawSev <= 3 ? "4" : "3");
            }

            const complaint = resource.code?.text || "未載明主訴";
            const time = new Date(resource.meta.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            const row = `
                <tr class="hover:bg-slate-50/80 transition-all group">
                    <td class="py-6 px-8">
                        <div class="${getESIClass(esiLevel)} w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm">
                            ${esiLevel}
                        </div>
                    </td>
                    <td class="py-6 px-4">
                        <div class="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 inline-block">
                            ${fhirPatientId}
                        </div>
                        <div class="text-[10px] text-purple-500 font-bold mt-1 uppercase tracking-tighter">
                            Org ID: 53652269
                        </div>
                    </td>
                    <td class="py-6 px-4">
                        <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                            ${complaint}
                        </span>
                    </td>
                    <td class="py-6 px-4 text-slate-500 font-medium">${time}</td>
                    <td class="py-6 px-8 text-right">
                        <button onclick="loadPatientDetail('${fhirPatientId}', '${resource.id}')" 
                                class="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-purple-600 transition-all text-sm">
                            進入診間
                        </button>
                    </td>
                </tr>`;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error("Fetch Error:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="py-20 text-center text-red-400">無法連線至 FHIR 伺服器</td></tr>';
    }
}// 輔助函式：取得 ESI 顏色
function getESIClass(level) {
    const classes = {
        "1": "bg-red-500 text-white",
        "2": "bg-orange-500 text-white",
        "3": "bg-yellow-400 text-slate-800",
        "4": "bg-green-500 text-white",
        "5": "bg-blue-500 text-white"
    };
    return classes[level] || "bg-slate-200";
}

// 跳轉到詳細儀表板
async function loadPatientDetail(patientId, conditionId) {
    // 1. 隱藏清單頁面
    document.getElementById('doctorListView').classList.add('hidden');
    // 2. 顯示你設計的詳細儀表板頁面
    document.getElementById('doctorDetailDashboard').classList.remove('hidden');
    
    // 3. 執行資料填入 (這部分需要對接你截圖中的各個欄位)
    console.log(`正在加載病患 ${patientId} 的 FHIR 資料...`);
    // fetchPatientFHIRData(patientId, conditionId);
}

// 全域變數，存放當前檢視的病患資料，方便後續「寫入 EMR」使用
let activePatientData = {};                                                                                                                                         

async function loadPatientDetail(patientId, conditionId) {
    // 1. 畫面切換：隱藏清單，顯示儀表板 (確保你的 HTML ID 正確)
    document.getElementById('doctorListView').classList.add('hidden');
    document.getElementById('doctorDetailDashboard').classList.remove('hidden');

    // 顯示載入動畫或文字
    console.log(`正在加載病患 ${patientId} 的詳細資料...`);

try {
        // 2. 抓取資源
        const [patientRes, conditionRes, allergyRes, medicationRes] = await Promise.all([
            fetch(`https://hapi.fhir.org/baseR4/Patient/${patientId}`).then(res => res.json()),
            fetch(`https://hapi.fhir.org/baseR4/Condition/${conditionId}`).then(res => res.json()),
            fetch(`https://hapi.fhir.org/baseR4/AllergyIntolerance?patient=${patientId}`).then(res => res.json()),
            fetch(`https://hapi.fhir.org/baseR4/MedicationStatement?patient=${patientId}`).then(res => res.json())
        ]);
        // 3. 填入「病患基本資料」區塊
        document.getElementById('displayPatientName').innerText = patientId; //  ID 代替姓名
        document.getElementById('displayGenderAge').innerText = `${patientRes.gender === 'female' ? '女' : '男'} / ${patientRes.birthDate || '年齡不詳'}`;
        document.getElementById('displayVisitTime').innerText = new Date(conditionRes.meta.lastUpdated).toLocaleString();

let esiLevel = "3"; // 預設值
        const noteText = conditionRes.note?.[0]?.text || ""; 
        
        if (noteText.includes("ESI_LEVEL:")) {
            // 從 "ESI_LEVEL:2 | 既往病史..." 中切出數字 2
            esiLevel = noteText.split("ESI_LEVEL:")[1].substring(0, 1);
        } else {
            // 如果 note 沒抓到，改用疼痛分數保險換算 (防止顯示 8/10 的 8)
            const sev = parseInt(conditionRes.severity?.text) || 5;
            esiLevel = sev >= 9 ? "2" : (sev <= 3 ? "4" : "3");
        }
        
        document.getElementById('aiEsiDisplay').innerText = esiLevel;
        updateEsiUI(esiLevel);
       
// 5. 填入症狀摘要 (修正性質顯示)
        const rawComplaint = conditionRes.code?.text || "";
        const mappedComplaint = mapComplaintToChinese(rawComplaint);
        document.getElementById('chiefComplaintDisplay').innerText = mappedComplaint;
        
        document.getElementById('onsetTimeDisplay').innerText = conditionRes.onsetString || "未載明";
        document.getElementById('severityDisplay').innerText = conditionRes.severity?.text || "0/10";
        
        // 性質顯示：過濾掉 ESI_LEVEL 標記，只顯示病史文字
        const cleanNote = noteText.includes('|') ? noteText.split('|')[1].trim() : noteText;
        document.getElementById('symptomNatureDisplay').innerText = cleanNote || "持續性";
        
        // 6. 填入「既往病史與用藥」區塊
        renderHistoryAndMed(allergyRes, medicationRes);

        // 7. 填入「AI 輔助臨床建議」 (根據症狀關鍵字給出建議)
        renderAiAdvice(mappedComplaint);

    } catch (error) {
        console.error("載入詳細病歷失敗:", error);
        alert("無法讀取 FHIR 資料，請確認網路連線。");
    }
}

// --- 輔助函式：主訴轉譯 ---
function mapComplaintToChinese(text) {
    if (text.includes('abdomen')) return "腹痛 (Abdominal Pain)";
    if (text.includes('chest')) return "胸痛 (Chest Pain)";
    if (text.includes('headache')) return "頭痛 (Headache)";
    return text || "一般症狀";
}

// --- 輔助函式：既往病史渲染 ---
function renderHistoryAndMed(allergyBundle, medBundle) {
    const allergyText = allergyBundle.entry ? 
        allergyBundle.entry.map(e => e.resource.note?.[0]?.text).join(', ') : "無已知過敏";
    const medText = medBundle.entry ? 
        medBundle.entry.map(e => e.resource.medicationCodeableConcept?.text).join(', ') : "無長期用藥";

    document.getElementById('pastHistoryDisplay').innerText = "無特殊病史"; // 這裡可根據 Condition.note 進一步解析
    document.getElementById('medicationDisplay').innerText = medText;
    document.getElementById('allergyDisplay').innerText = allergyText;
}

// --- 輔助函式：更新 ESI UI 樣式 ---
function updateEsiUI(level) {
    // 直接呼叫我們剛寫好的 manualUpdateESI，這樣邏輯就不用寫兩次
    // 記得把 level 轉成數字
    manualUpdateESI(parseInt(level));
}

// --- 補上缺失的渲染 AI 建議函式 ---
function renderAiAdvice(complaint) {
    const ddxContainer = document.getElementById('ddxList');
    const treatmentContainer = document.getElementById('treatmentAdviceList');
    
    // 預設內容
    let ddxData = [];
    let treatmentData = [];

    // 根據主訴關鍵字模擬 AI 判斷邏輯
    if (complaint.includes('腹痛')) {
        ddxData = [
            { name: "急性闌尾炎 (Acute Appendicitis)", prob: "中度風險", desc: "需注意右下腹壓痛與反彈痛。" },
            { name: "急性胃炎 (Acute Gastritis)", prob: "高度風險", desc: "常伴隨上腹部灼熱感或噁心。" },
            { name: "尿路結石 (Urolithiasis)", prob: "低度風險", desc: "需確認是否有放射性腰痛或血尿。" }
        ];
        treatmentData = ["腹部超音波檢驗", "血常規檢查 (CBC/CRP)", "安排尿液分析", "禁食 (NPO) 觀察"];
    } else if (complaint.includes('胸痛')) {
        ddxData = [
            { name: "急性心肌梗塞 (AMI)", prob: "高危急", desc: "需立即追蹤 EKG 與 Troponin。" },
            { name: "主動脈剝離 (Aortic Dissection)", prob: "危急", desc: "需排除撕裂樣背痛。" }
        ];
        treatmentData = ["立即心電圖 (12-Lead EKG)", "心肌酵素抽血", "建立靜脈通路", "胸部 X 光"];
    } else {
        ddxData = [{ name: "待進一步評估", prob: "--", desc: "初步症狀不明確，請結合臨床判斷。" }];
        treatmentData = ["測量生命徵象", "詳細問診"];
    }

    // 1. 渲染鑑別診斷 (DDx)
    ddxContainer.innerHTML = ddxData.map((d, i) => `
        <div class="flex items-start gap-4 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-colors">
            <div class="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">${i+1}</div>
            <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-slate-800">${d.name}</span>
                    <span class="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md font-bold border border-purple-100">${d.prob}</span>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed">${d.desc}</p>
            </div>
        </div>
    `).join('');

    // 2. 渲染處置建議
    treatmentContainer.innerHTML = treatmentData.map(t => `
        <div class="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <i class="fas fa-notes-medical text-emerald-500 text-sm"></i>
            <span class="text-sm font-medium text-emerald-700">${t}</span>
        </div>
    `).join('');
}

// --- 補上之前提到的返回函式 ---
function backToList() {
    document.getElementById('doctorDetailDashboard').classList.add('hidden');
    document.getElementById('doctorListView').classList.remove('hidden');
    refreshWaitingList(); // 返回時自動更新一次清單
}

// 在醫師詳細儀表板渲染
function renderDoctorDashboard(analysis) {
    document.getElementById('aiEsiDisplay').innerText = analysis.esi;
    document.getElementById('suggestedDeptDisplay').innerText = analysis.dept;
    
    // 渲染 DDx 列表
    const ddxHtml = analysis.ddx.map((item, i) => `<li>${i+1}. ${item}</li>`).join('');
    document.getElementById('ddxList').innerHTML = ddxHtml;
    
    // 渲染處置建議
    const txHtml = analysis.treatment.map(item => `<span>${item}</span>`).join(' | ');
    document.getElementById('treatmentAdviceList').innerHTML = txHtml;
}

function manualUpdateESI(level) {
    const config = {
        1: { text: "立即搶救", bg: "bg-red-50", border: "border-red-600", textCol: "text-red-600", btnBg: "bg-red-600" },
        2: { text: "危急", bg: "bg-orange-50", border: "border-orange-500", textCol: "text-orange-500", btnBg: "bg-orange-500" },
        3: { text: "急迫", bg: "bg-yellow-50", border: "border-yellow-400", textCol: "text-yellow-600", btnBg: "bg-yellow-400" },
        4: { text: "非緊急", bg: "bg-green-50", border: "border-green-500", textCol: "text-green-600", btnBg: "bg-green-500" },
        5: { text: "輕微", bg: "bg-emerald-50", border: "border-emerald-600", textCol: "text-emerald-600", btnBg: "bg-emerald-600" }
    };

    const target = config[level];
    if (!target) return;

    // 1. 更新數字與文字內容
    document.getElementById('aiEsiDisplay').innerText = level;
    document.getElementById('esiStatusDisplay').innerText = target.text;

    // 2. 更新大圓圈顏色 (不使用 className =，避免洗掉佈局)
    const circle = document.getElementById('esiCircle');
    const allColorClasses = [
        "bg-red-50", "bg-orange-50", "bg-yellow-50", "bg-green-50", "bg-emerald-50",
        "border-red-600", "border-orange-500", "border-yellow-400", "border-green-500", "border-emerald-600",
        "text-red-600", "text-orange-500", "text-yellow-600", "text-green-600", "text-emerald-600"
    ];
    circle.classList.remove(...allColorClasses);
    circle.classList.add(target.bg, target.border, target.textCol);

    // 3. 更新下方按鈕 1-5 樣式
    const btns = document.querySelectorAll('.esi-btn');
    btns.forEach((btn, index) => {
        const btnLevel = index + 1;
        // 移除所有選中狀態的樣式
        const activeClasses = ["bg-red-600", "bg-orange-500", "bg-yellow-400", "bg-green-500", "bg-emerald-600", "text-white", "border-2", "border-transparent"];
        btn.classList.remove(...activeClasses);
        
        if (btnLevel === level) {
            // 被選中的按鈕
            btn.classList.add(target.btnBg, "text-white", "border-transparent");
        } else {
            // 未選中的按鈕恢復預設
            btn.classList.add("text-slate-400", "border");
        }
    });
}