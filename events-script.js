// تحميل البيانات من الخادم
let news = [];

// تهيئة Particles.js
particlesJS('particles-js', {
    particles: {
        number: { value: 30 },
        color: { value: '#FFD700' },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 2 },
        move: { speed: 1, direction: 'none', random: true }
    },
    interactivity: {
        events: { onhover: { enable: true, mode: 'repulse' } }
    }
});

// عرض الأحداث مع الصور
function displayNews() {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';
    news.forEach(item => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p>`;
        if (item.image) {
            div.innerHTML += `<img src="${item.image}" width="150" height="100" alt="صورة الحدث">`;
        }
        newsList.appendChild(div);
    });
}

// تحميل الأحداث من الخادم
function loadNews() {
    fetch('get_events.php')
        .then(response => response.json())
        .then(data => {
            news = data;
            displayNews();
        })
        .catch(error => {
            console.error('Error loading news:', error);
            // Fallback to localStorage if server fails
            news = JSON.parse(localStorage.getItem('news')) || [];
            displayNews();
        });
}

window.onload = loadNews;

// إضافة listener لتحديث الأحداث عند تغيير localStorage من صفحات أخرى
window.addEventListener('storage', function(e) {
    if (e.key === 'news') {
        loadNews(); // Reload from server
    }
});
