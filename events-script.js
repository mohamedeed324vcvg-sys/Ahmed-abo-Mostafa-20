// تحميل البيانات من localStorage
let news = JSON.parse(localStorage.getItem('news')) || [];

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

window.onload = displayNews;