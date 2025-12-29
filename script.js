const elements = [
    { n: 1, s: "H", name: "氫", en: "Hydrogen", mass: 1 },
    { n: 2, s: "He", name: "氦", en: "Helium", mass: 4 },
    { n: 3, s: "Li", name: "鋰", en: "Lithium", mass: 7 },
    { n: 4, s: "Be", name: "鈹", en: "Beryllium", mass: 9 },
    { n: 5, s: "B", name: "硼", en: "Boron", mass: 11 },
    { n: 6, s: "C", name: "碳", en: "Carbon", mass: 12 },
    { n: 7, s: "N", name: "氮", en: "Nitrogen", mass: 14 },
    { n: 8, s: "O", name: "氧", en: "Oxygen", mass: 16 },
    { n: 9, s: "F", name: "氟", en: "Fluorine", mass: 19 },
    { n: 10, s: "Ne", name: "氖", en: "Neon", mass: 20 },
    { n: 11, s: "Na", name: "鈉", en: "Sodium", mass: 23 },
    { n: 12, s: "Mg", name: "鎂", en: "Magnesium", mass: 24 },
    { n: 13, s: "Al", name: "鋁", en: "Aluminum", mass: 27 },
    { n: 14, s: "Si", name: "矽", en: "Silicon", mass: 28 },
    { n: 15, s: "P", name: "磷", en: "Phosphorus", mass: 31 },
    { n: 16, s: "S", name: "硫", en: "Sulfur", mass: 32 },
    { n: 17, s: "Cl", name: "氯", en: "Chlorine", mass: 35 },
    { n: 18, s: "Ar", name: "氬", en: "Argon", mass: 40 },
    { n: 19, s: "K", name: "鉀", en: "Potassium", mass: 39 },
    { n: 20, s: "Ca", name: "鈣", en: "Calcium", mass: 40 }
];

let isChallengeMode = false;
const modal = document.getElementById('quiz-modal');

// --- 頁面切換 ---
function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    if(pageId === 'symbol-game') {
        document.getElementById('nav-symbol').classList.add('active');
        initSymbolTable();
    } else {
        document.getElementById('nav-structure').classList.add('active');
        initStructureGrid();
    }
}

// --- 符號記憶 (含英文) ---
function initSymbolTable() {
    const table = document.getElementById('table');
    table.innerHTML = ''; 
    elements.forEach(el => {
        const card = document.createElement('div');
        card.className = 'element-card' + (isChallengeMode ? ' clickable' : '');
        let content = `<span class="atomic-number">${el.n}</span>`;
        if (isChallengeMode) {
            content += `<input type="text" maxlength="2" data-ans="${el.s}" onclick="event.stopPropagation()">`;
        } else {
            content += `<span class="symbol">${el.s}</span>`;
        }
        content += `<span class="name-zh">${el.name}</span><span class="name-en">${el.en}</span>`;
        card.innerHTML = content;
        if (isChallengeMode) {
            card.onclick = () => {
                const input = card.querySelector('input');
                if (!input.value) return;
                const isCorrect = input.value.trim().toLowerCase() === input.dataset.ans.toLowerCase();
                card.classList.remove('correct', 'wrong');
                card.classList.add(isCorrect ? 'correct' : 'wrong');
                updateScore();
            };
        }
        table.appendChild(card);
    });
}

function updateScore() {
    document.getElementById('score').innerText = document.querySelectorAll('#symbol-game .correct').length;
}

document.getElementById('toggle-mode').onclick = function() {
    isChallengeMode = !isChallengeMode;
    this.innerText = isChallengeMode ? "回到學習模式" : "進入挑戰模式";
    document.getElementById('mode-text').innerText = isChallengeMode ? "挑戰模式 (點擊卡片檢查)" : "學習模式";
    initSymbolTable();
};

// --- 結構挑戰 (彈窗) ---
function initStructureGrid() {
    const grid = document.getElementById('structure-grid');
    grid.innerHTML = '';
    elements.forEach(el => {
        const card = document.createElement('div');
        card.className = 'element-card clickable';
        card.innerHTML = `<span class="atomic-number">${el.n}</span><span class="symbol">${el.s}</span><span class="name-zh">${el.name}</span><span class="name-en">${el.en}</span>`;
        card.onclick = () => openQuiz(el);
        grid.appendChild(card);
    });
}

function openQuiz(el) {
    const n = el.mass - el.n;
    document.getElementById('modal-body').innerHTML = `
        <h2>${el.name} (${el.s})</h2>
        <p style="text-align:center;">Z: ${el.n} | n: ${n}</p>
        <div class="input-group"><span>Electrons (e-):</span> <input type="number" id="q-e" data-ans="${el.n}"></div>
        <div class="input-group"><span>Mass Number (A):</span> <input type="number" id="q-a" data-ans="${el.mass}"></div>
        <button class="btn-submit" onclick="checkModalAnswer()">檢查</button>`;
    modal.style.display = "block";
}

function checkModalAnswer() {
    document.querySelectorAll('#modal-body input').forEach(input => {
        const isCorrect = parseInt(input.value) === parseInt(input.dataset.ans);
        input.classList.remove('correct', 'wrong');
        input.classList.add(isCorrect ? 'correct' : 'wrong');
    });
}

function closeModal() { modal.style.display = "none"; }
window.onclick = (e) => { if (e.target == modal) closeModal(); };

// --- 主題切換 ---
document.getElementById('theme-toggle').onclick = () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    initSymbolTable();
};