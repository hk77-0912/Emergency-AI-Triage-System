// 1. 確保變數都有宣告
let selectedSymptomCode = '';
let currentPatientId = ''; 

    function navigateToForm() {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('formSection').classList.remove('hidden');
    }    

function setGender(value) {
    document.getElementById('gender').value = value;
    document.querySelectorAll('#fhirForm .segmented-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + value).classList.add('active');
}

// FHIR Patient 資料送出邏輯
document.getElementById('fhirForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = '正在傳送...';
    
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const patientId = document.getElementById('patientId').value;
    const birthDate = document.getElementById('birthDate').value;

    const patientResource = {
        resourceType: "Patient",
        identifier: [{ system: "http://hospital.gov.tw/id", value: patientId }],
        name: [{ use: "official", text: name }],
        gender: gender || 'unknown', 
        birthDate: birthDate,

        managingOrganization: {
            reference: "Organization/53652269", 
            display: "這個好，真噠!"
        }
    };

    try {
        const response = await fetch('https://hapi.fhir.org/baseR4/Patient', {
            method: 'POST',
            headers: { 'Content-Type': 'application/fhir+json' },
            body: JSON.stringify(patientResource)
        });

        if (response.ok) {
            const data = await response.json();
            currentPatientId = data.id; 
            console.log("成功存入 FHIR！資源 ID 為:", currentPatientId);
            
            // 執行收摺動畫
            document.getElementById('formCardWrapper').classList.add('collapsed');
            
            // 填充摘要列資訊
            document.getElementById('summaryName').innerText = name;
            document.getElementById('summaryFHIRId').innerText = currentPatientId;
            const genderLabel = gender === 'male' ? '男' : (gender === 'female' ? '女' : '其他');
            document.getElementById('summaryInfo').innerText = `${genderLabel} · 生日: ${birthDate}`;

            // 延遲顯示，確保動畫流暢
            setTimeout(() => {
                // 隱藏表單
                document.getElementById('formCardWrapper').classList.add('hidden');
                
                // 顯示後續區塊 (移除會報錯的 successAlert)
                if (document.getElementById('patientSummary')) document.getElementById('patientSummary').classList.remove('hidden');
                if (document.getElementById('stepper')) document.getElementById('stepper').classList.remove('hidden');
                if (document.getElementById('symptomStep1')) document.getElementById('symptomStep1').classList.remove('hidden');

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);

        } else { throw new Error('伺服器連線失敗'); }
    } catch (error) {
        console.error(error);
        alert('錯誤: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerText = '重新嘗試傳送';
    }
});

// Step 1: 選擇症狀邏輯
function selectSymptom(element, code) {
    document.querySelectorAll('.symptom-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    selectedSymptomCode = code;
    
    const btn = document.getElementById('toStep2Btn');
    if (btn) {
        btn.disabled = false;
        btn.classList.remove('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
        btn.classList.add('bg-blue-600', 'text-white');
    }
}

// Step 2 Logic
function goToStep2() {
    document.getElementById('step-1-circle').innerHTML = '✓';
    document.getElementById('step-1-circle').classList.add('step-done');
    document.getElementById('step-2-circle').classList.add('step-active');

    document.getElementById('symptomStep1').classList.add('hidden');
    document.getElementById('symptomStep2').classList.remove('hidden');

    document.querySelectorAll('#dynamicQuestionArea > div').forEach(div => div.classList.add('hidden'));
    const targetBlock = document.getElementById(`block-${selectedSymptomCode}`);
    if(targetBlock) targetBlock.classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToStep1() {
    document.getElementById('symptomStep2').classList.add('hidden');
    document.getElementById('symptomStep1').classList.remove('hidden');
}

function updateSeverity(val) {
    document.getElementById('severityValue').innerText = val + ' 分';
}

function toggleChip(el) {
    el.classList.toggle('active');
    if(el.classList.contains('active')) {
        el.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
    } else {
        el.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
    }
}

function setSegmented(el, group) {
    el.parentNode.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
    });
    el.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
}

function goToStep3() {
    // 1. 更新進度條狀態 (Step 2 完成)
    document.getElementById('step-2-circle').innerHTML = '✓';
    document.getElementById('step-2-circle').classList.remove('step-active');
    document.getElementById('step-2-circle').classList.add('step-done');
    
    // 2. 啟動 Step 3 狀態
    document.getElementById('step-3-circle').classList.add('step-active');

    // 3. 切換頁面
    document.getElementById('symptomStep2').classList.add('hidden');
    document.getElementById('symptomStep3').classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToStep2() {
    document.getElementById('symptomStep3').classList.add('hidden');
    document.getElementById('symptomStep2').classList.remove('hidden');
}

// 跳轉到第四步：用藥過敏
function goToStep4() {
    // 邏輯同上，切換到 symptomStep4
}

function goToStep4() {
    // 更新進度條：Step 3 完成
    document.getElementById('step-3-circle').innerHTML = '✓';
    document.getElementById('step-3-circle').classList.remove('step-active');
    document.getElementById('step-3-circle').classList.add('step-done');
    
    // 啟動 Step 4
    document.getElementById('step-4-circle').classList.add('step-active');

    document.getElementById('symptomStep3').classList.add('hidden');
    document.getElementById('symptomStep4').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToStep3() {
    document.getElementById('symptomStep4').classList.add('hidden');
    document.getElementById('symptomStep3').classList.remove('hidden');
}

function goToStep5() {
    // 更新進度條：Step 4 完成
    document.getElementById('step-4-circle').innerHTML = '✓';
    document.getElementById('step-4-circle').classList.remove('step-active');
    document.getElementById('step-4-circle').classList.add('step-done');

    // 啟動 Step 5
    document.getElementById('step-5-circle').classList.add('step-active');


    // 1. 隱藏 Step 4
    const step4 = document.getElementById('symptomStep4');
    if (step4) step4.classList.add('hidden');

    // 2. 顯示 Step 5
    const step5 = document.getElementById('symptomStep5');
    if (step5) {
        step5.classList.remove('hidden');
    } else {
        console.error("錯誤：找不到 id='symptomStep5' 的 HTML 元素");
        alert("資料已傳送，但找不到結果頁面。");
    }


    // 3. 在頁面顯示 Patient ID 供核對
    const refDisplay = document.getElementById('finalPatientRef');
    if (refDisplay && typeof currentPatientId !== 'undefined') {
        refDisplay.innerText = "FHIR Patient Resource ID: " + currentPatientId;
    }
}

async function submitAllData() {
    const btn = document.getElementById('finalSubmitBtn') || event.target;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 正在上傳資料...';

    try {
        if (!currentPatientId) {
            throw new Error("找不到病患 ID，請確保已完成基本資料登記。");
        }

        // 收集關鍵數據
        const onsetTime = document.getElementById('onsetTime')?.value || new Date().toISOString();
        const severity = parseInt(document.getElementById('severityRange')?.value) || 5;
        const qualities = Array.from(document.querySelectorAll('.chip.active')).map(el => el.innerText).join(', ');

        // --- 核心修正：計算穩定版 ESI (防止出現 6-10) ---
        let finalEsi = 3; 
        if (severity >= 9) finalEsi = 2;
        else if (severity <= 3) finalEsi = 4;
        
        // 將 ESI 強制顯示在介面上，確保病患端看到的也是這個數字
        const esiDisplay = document.getElementById('esiLevel');
        if (esiDisplay) esiDisplay.innerText = finalEsi;

        // 收集文字
        const historyText = document.getElementById('pastHistory')?.value || "無紀錄";
        const medicationText = document.getElementById('medicationInfo')?.value || "無長期用藥";
        const allergyText = document.getElementById('allergyInfo')?.value || "無已知過敏";

        // (A) Condition: 將 ESI 藏在 note 裡，醫師端讀取這個標籤
        const conditionResource = {
            resourceType: "Condition",
            clinicalStatus: {
                coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }]
            },
            code: { text: `主要症狀: ${selectedSymptomCode || '未指定'}. 性質: ${qualities}` },
            subject: { reference: `Patient/${currentPatientId}` },
            onsetString: onsetTime,
            severity: { text: `${severity}/10` },
            // 重要：醫師端會讀取這個 "ESI_LEVEL:X"
            note: [{ text: `ESI_LEVEL:${finalEsi} | 既往病史: ${historyText}` }]
        };

        const allergyResource = {
            resourceType: "AllergyIntolerance",
            clinicalStatus: {
                coding: [{ system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", code: "active" }]
            },
            patient: { reference: `Patient/${currentPatientId}` },
            note: [{ text: allergyText }]
        };

        const medicationResource = {
            resourceType: "MedicationStatement",
            status: "active",
            subject: { reference: `Patient/${currentPatientId}` },
            dateAsserted: new Date().toISOString(),
            medicationCodeableConcept: { text: medicationText }
        };

        const endpoints = [
            { path: 'Condition', body: conditionResource },
            { path: 'AllergyIntolerance', body: allergyResource },
            { path: 'MedicationStatement', body: medicationResource }
        ];

        const requests = endpoints.map(item => 
            fetch(`https://hapi.fhir.org/baseR4/${item.path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/fhir+json' },
                body: JSON.stringify(item.body)
            })
        );

        const responses = await Promise.all(requests);
        
        for (let i = 0; i < responses.length; i++) {
            if (!responses[i].ok) {
                const errText = await responses[i].text();
                throw new Error(`${endpoints[i].path} 格式錯誤: ${responses[i].status}`);
            }
        }

        console.log(`所有臨床資料上傳成功！最終 ESI: ${finalEsi}`);
        
        // 確保先執行分析再跳轉
        try {
            runAIAnalysis(); 
        } catch(e) { 
            console.warn("AI 分析執行失敗，使用基礎 ESI 顯示", e); 
        }
        
        goToStep5();

    } catch (error) {
        console.error("傳送錯誤:", error);
        alert(error.message);
        btn.disabled = false;
        btn.innerHTML = "重新嘗試送出";
    }
}

function runAIAnalysis() {
    const symptom = selectedSymptomCode; 
    const severity = parseInt(document.getElementById('severityRange').value) || 5;
    
    // --- 1. 核心邏輯：必須跟 submitAllData 完全一致 ---
    let finalEsi = 3;
    if (severity >= 9) finalEsi = 2;
    else if (severity <= 3) finalEsi = 4;

    let analysis = {
        esi: finalEsi,
        status: finalEsi === 2 ? "危急" : (finalEsi === 3 ? "急迫" : "穩定"),
        wait: finalEsi === 2 ? "10 分鐘內" : (finalEsi === 3 ? "30-60 分鐘" : "60 分鐘以上"),
        dept: "一般內科",
        diagnosis: [],
        treatments: ["生命徵象監測", "視情況安排抽血檢驗"]
    };

    // --- 2. 根據症狀微調建議 (不影響 Esi 數字，只影響文字描述) ---
    if (symptom === 'chest') {
        analysis.dept = "心臟內科 / 急診內科";
        analysis.diagnosis = [
            { name: "急性心肌梗塞", prob: "需排除", desc: "壓迫性胸痛伴隨冒冷汗為典型表現" },
            { name: "主動脈剝離", prob: "需排除", desc: "需注意是否有突發性撕裂樣疼痛" }
        ];
        analysis.treatments = ["心電圖 (EKG)", "心肌酵素抽血 (Troponin)", "胸部 X 光"];
    } else if (symptom === 'abdomen') {
        analysis.dept = "急診外科 / 腸胃科";
        analysis.diagnosis = [
            { name: "急性胃炎", prob: "中度可能", desc: "上腹痛，可能與飲食或壓力相關" },
            { name: "急性闌尾炎", prob: "待排除", desc: "若疼痛轉移至右下腹需立即告知醫護" }
        ];
        analysis.treatments = ["腹部理學檢查", "抽血檢驗 (CBC/CRP)", "禁食觀察"];
    } else {
        // 其他症狀的預設建議
        analysis.diagnosis = [{ name: "待醫師評估", prob: "--", desc: "請稍候，醫師將為您進行詳細診察" }];
    }

    // --- 3. 更新 UI (確保 ID 對應正確) ---
    document.getElementById('esiLevel').innerText = analysis.esi;
    document.getElementById('esiStatus').innerText = analysis.status;
    document.getElementById('waitTime').innerText = "約 " + analysis.wait;
    document.getElementById('suggestedDept').innerText = analysis.dept;

    // 更新顏色 (額外加這段會讓 Demo 看起來更專業)
    const esiCircle = document.getElementById('esiLevel');
    if (finalEsi <= 2) esiCircle.className = "text-5xl font-black my-2 text-red-600";
    else if (finalEsi == 3) esiCircle.className = "text-5xl font-black my-2 text-yellow-500";
    else esiCircle.className = "text-5xl font-black my-2 text-green-500";

    // 渲染診斷清單 (原本的 logic 不變)
    const diagContainer = document.getElementById('diagnosisList');
    diagContainer.innerHTML = analysis.diagnosis.map((d, i) => `
        <div class="flex items-start gap-4 p-4 border border-slate-100 rounded-2xl mb-2">
            <div class="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">${i+1}</div>
            <div class="flex-1">
                <div class="flex justify-between mb-1">
                    <span class="font-bold text-slate-800">${d.name}</span>
                    <span class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md">${d.prob}</span>
                </div>
                <p class="text-xs text-slate-500">${d.desc}</p>
            </div>
        </div>
    `).join('');

    // 渲染處置清單 (原本的 logic 不變)
    document.getElementById('treatmentList').innerHTML = analysis.treatments.map(t => `
        <li class="flex items-center gap-2 mb-1">
            <span class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span> ${t}
        </li>
    `).join('');
}
// 單選 Chip 處理 (如同組按鈕只能選一個)
function toggleSingleChip(button, groupName) {
    // 找到同一個父容器下的所有按鈕並移除選取狀態
    const parent = button.parentElement;
    parent.querySelectorAll('.chip').forEach(btn => {
        btn.classList.remove('bg-red-600', 'text-white', 'border-red-600', 'selected');
        btn.classList.add('bg-white', 'text-slate-600', 'border-red-100');
    });

    // 設定當前按鈕為選取狀態
    button.classList.remove('bg-white', 'text-slate-600', 'border-red-100');
    button.classList.add('bg-red-600', 'text-white', 'border-red-600', 'selected');
}