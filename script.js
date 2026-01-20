const firebaseConfig = {
    apiKey: "AIzaSyBIDS6ys_9jhHpvqZ0JH5_CjeOa7xopu",
    authDomain: "web-vm-7b3ab.firebaseapp.com",
    projectId: "web-vm-7b3ab",
    storageBucket: "web-vm-7b3ab.firebasestorage.app",
    messagingSenderId: "837705963154",
    appId: "1:837705963154:web:c15525d4e95e1d4cd2784b"
};

// Инициализация
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentUser = localStorage.getItem('vm_user') || "";

// --- ЛОГИКА ВХОДА ---
window.onload = () => {
    if (currentUser) {
        document.getElementById('login-overlay').classList.add('hidden');
        document.getElementById('user-display').innerText = currentUser;
        loadVMs(); // ТЕПЕРЬ ОНА ЗАПУСКАЕТСЯ
    }
};

function login() {
    const name = document.getElementById('username-input').value;
    if (name.trim()) {
        currentUser = name;
        localStorage.setItem('vm_user', name);
        document.getElementById('login-overlay').classList.add('hidden');
        document.getElementById('user-display').innerText = name;
        loadVMs();
    }
}

// --- РАБОТА С ОБЛАКОМ ---
function loadVMs() {
    // Слушаем изменения в коллекции "machines" в реальном времени
    db.collection("machines").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
        const grid = document.getElementById('vm-grid');
        grid.innerHTML = "";
        
        snapshot.forEach((doc) => {
            const vm = doc.data();
            if (vm.public || vm.author === currentUser) {
                const card = document.createElement('div');
                card.className = "vm-card";
                card.innerHTML = `
                    <div class="author">От: ${vm.author} ${vm.public ? '🌐' : '🔒'}</div>
                    <h3>${vm.name}</h3>
                    <p>ISO: ${vm.iso}</p>
                    <button class="btn-run" onclick="runVM('${vm.name}')">Запустить</button>
                `;
                grid.appendChild(card);
            }
        });
    }, (error) => {
        console.error("Ошибка Firestore:", error);
        if (error.code === 'permission-denied') {
            alert("Ошибка: Доступ запрещен. Проверьте вкладку Rules в Firebase!");
        }
    });
}

function createVM() {
    const name = document.getElementById('vm-name').value;
    const isPublic = document.getElementById('is-public').checked;
    const file = document.getElementById('iso-file').files[0];

    if (!name || !file) return alert("Заполните все поля!");

    db.collection("machines").add({
        name: name,
        author: currentUser,
        public: isPublic,
        iso: file.name,
        createdAt: firebase.firestore.FieldValue.serverTimestamp() // Серверное время
    }).then(() => {
        toggleModal(false);
        document.getElementById('vm-name').value = ""; // Очистка
    }).catch((error) => {
        alert("Ошибка при публикации. Проверьте Rules в консоли Firebase.");
    });
}

// --- СИМУЛЯЦИЯ ВИРТУАЛЬНОЙ МАШИНЫ ---
function runVM(name) {
    const bootScreen = document.getElementById('boot-screen');
    const log = document.getElementById('boot-log');
    bootScreen.classList.remove('hidden');
    log.innerHTML = `<div style="color:cyan">--- Инициализация системы ${name} ---</div>`;

    const bootMessages = [
        "Загрузка образа ISO...",
        "Проверка оперативной памяти... 1024MB OK",
        "Поиск загрузочного сектора...",
        "Запуск виртуального ядра...",
        "Система готова к работе."
    ];

    bootMessages.forEach((msg, index) => {
        setTimeout(() => {
            log.innerHTML += `<div>[ OK ] ${msg}</div>`;
        }, (index + 1) * 700);
    });
}

function closeVM() {
    document.getElementById('boot-screen').classList.add('hidden');
}

function toggleModal(show) {
    const modal = document.getElementById('vm-modal');
    show ? modal.classList.remove('hidden') : modal.classList.add('hidden');
}
