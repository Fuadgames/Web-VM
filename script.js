let currentUser = localStorage.getItem('vm_user') || "";
let vms = JSON.parse(localStorage.getItem('vm_list')) || [
    { name: "Ubuntu 22.04", author: "System", public: true, iso: "ubuntu.iso" },
    { name: "Windows 11 Lite", author: "Admin", public: true, iso: "win11.iso" }
];

// Проверка входа
window.onload = () => {
    if (currentUser) {
        document.getElementById('login-overlay').classList.add('hidden');
        document.getElementById('user-display').innerText = currentUser;
        renderVMs();
    }
};

function login() {
    const name = document.getElementById('username-input').value;
    if (name.trim()) {
        currentUser = name;
        localStorage.setItem('vm_user', name);
        document.getElementById('login-overlay').classList.add('hidden');
        document.getElementById('user-display').innerText = name;
        renderVMs();
    }
}

function toggleModal(show) {
    const modal = document.getElementById('vm-modal');
    show ? modal.classList.remove('hidden') : modal.classList.add('hidden');
}

function createVM() {
    const name = document.getElementById('vm-name').value;
    const isPublic = document.getElementById('is-public').checked;
    const file = document.getElementById('iso-file').files[0];

    if (!name || !file) return alert("Заполните все поля!");

    const newVM = {
        name: name,
        author: currentUser,
        public: isPublic,
        iso: file.name
    };

    vms.push(newVM);
    localStorage.setItem('vm_list', JSON.stringify(vms));
    renderVMs();
    toggleModal(false);
}

function renderVMs() {
    const grid = document.getElementById('vm-grid');
    grid.innerHTML = "";

    vms.forEach((vm, index) => {
        // Показываем если публичная ИЛИ если автор - текущий пользователь
        if (vm.public || vm.author === currentUser) {
            const card = document.createElement('div');
            card.className = "vm-card";
            card.innerHTML = `
                <div class="author">Опубликовал: ${vm.author} ${vm.public ? '🌐' : '🔒'}</div>
                <h3>${vm.name}</h3>
                <p>ISO: ${vm.iso}</p>
                <button class="btn-run" onclick="runVM('${vm.name}')">Запустить</button>
            `;
            grid.appendChild(card);
        }
    });
}

// Симуляция запуска
function runVM(name) {
    const bootScreen = document.getElementById('boot-screen');
    const log = document.getElementById('boot-log');
    bootScreen.classList.remove('hidden');
    log.innerHTML = "";

    const messages = [
        `[ OK ] Loading kernel for ${name}...`,
        "[ OK ] Mounting file systems...",
        "[ INFO ] Checking ISO integrity...",
        "[ OK ] Starting Virtual CPU Core 0...",
        "[ OK ] Starting Virtual CPU Core 1...",
        `[ SUCCESS ] ${name} is ready.`
    ];

    messages.forEach((msg, i) => {
        setTimeout(() => {
            log.innerHTML += `<div>${msg}</div>`;
        }, i * 600);
    });
}

function closeVM() {
    document.getElementById('boot-screen').classList.add('hidden');
}
