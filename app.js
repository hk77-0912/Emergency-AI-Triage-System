/**
 * 智慧急診 AI 分流系統 - 邏輯控制中心
 */

// --- 全域變數 ---
let selectedSymptomCode = '';
let currentPatientId = ''; 

// --- 1. 頁面導覽與進度控制 ---
function navigateToForm() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('formSection').classList.remove('hidden');
}

function setGender(value) {
    document.getElementById('gender').value = value;
    document.querySelectorAll('#fhirForm .segmented-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + value).classList.add('active');
}

// --- 2. FHIR Patient 資源傳送 ---
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
        birthDate: birthDate
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
            
            // 動態收摺動畫
            document.getElementById('formCardWrapper').classList.add('collapsed');
            
            // 更新摘要資訊
            document.getElementById('summaryName').innerText = name;
            document.getElementById('summaryFHIRId').innerText = currentPatientId;
            const genderLabel = gender === 'male' ? '男' : (gender === 'female' ? '女' : '其他');
            document.getElementById('summaryInfo').innerText = `${genderLabel} · 生日: ${birthDate}`;

            setTimeout(() => {
                document.getElementById('formCardWrapper').classList.add('hidden');
                document.getElementById('patientSummary').classList.remove('hidden');
                document.getElementById('stepper').classList.remove('hidden');
                document.getElementById('symptomStep1').classList.remove('hidden');
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

// --- 3. 問卷互動邏輯 ---

// Step 1: 選擇症狀
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

// Step 2: 症狀細部
function goToStep2() {
    updateStepperProgress(1, 2);
    document.getElementById('symptomStep1').classList.add('hidden');
    document.getElementById('symptomStep2').classList.remove('hidden');

    // 顯示對應的症狀專屬題組
    document.querySelectorAll('#dynamicQuestionArea > div').forEach(div => div.classList.add('hidden'));
    const targetBlock = document.getElementById(`block-${selectedSymptomCode}`);
    if(targetBlock) targetBlock.classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToStep1() {
    document.getElementById('symptomStep2').classList.add('hidden');
    document.getElementById('symptomStep1').classList.remove('hidden');
}

// Step 3 & 4: 既往與過敏
function goToStep3() {
    updateStepperProgress(2, 3);
    document.getElementById('symptomStep2').classList.add('hidden');
    document.getElementById('symptomStep3').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToStep2() {
    document.getElementById('symptomStep3').classList.add('hidden');
    document.getElementById('symptomStep2').classList.remove('hidden');
}

function goToStep4() {
    updateStepperProgress(3, 4);
    document.getElementById('symptomStep3').classList.add('hidden');
    document.getElementById('symptomStep4').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToStep3() {
    document.getElementById('symptomStep4').classList.add('hidden');
    document.getElementById('symptomStep3').classList.remove('hidden');
}

// Step 5: AI 分析結果
async function submitAllData() {
    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> AI 分析中...';

    setTimeout(() => {
        updateStepperProgress(4, 5);
        document.getElementById('symptomStep4').classList.add('hidden');
        document.getElementById('resultSection').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// --- 輔助工具 ---
function updateStepperProgress(finishStep, nextStep) {
    const finishCircle = document.getElementById(`step-${finishStep}-circle`);
    const nextCircle = document.getElementById(`step-${nextStep}-circle`);
    
    if(finishCircle) {
        finishCircle.innerHTML = '✓';
        finishCircle.classList.remove('step-active');
        finishCircle.classList.add('step-done');
    }
    if(nextCircle) {
        nextCircle.classList.add('step-active');
    }
}

function updateSeverity(val) {
    document.getElementById('severityValue').innerText = val + ' 分';
}

function toggleChip(el) {
    el.classList.toggle('active');
    // 注意：樣式已在 style.css 中處理
}

function setSegmented(el, group) {
    el.parentNode.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
    });
    el.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
}
