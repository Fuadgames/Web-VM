// Вставь сюда данные, которые ты скопировал на Шаге 1
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

// Функция загрузки машин из ОБЛАКА (Firestore)
function loadVMs() {
    db.collection("machines").onSnapshot((snapshot) => {
        const grid = document.getElementById('vm-grid');
        grid.innerHTML = "";
        
        snapshot.forEach((doc) => {
            const vm = doc.data();
            // Показываем, если публичная или ты автор
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
    });
}

// Функция создания и отправки в ОБЛАКО
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
        createdAt: new Date()
    }).then(() => {
        toggleModal(false);
    }).catch((error) => {
        console.error("Ошибка при публикации: ", error);
    });
}

// Не забудь вызвать loadVMs() при входе!
