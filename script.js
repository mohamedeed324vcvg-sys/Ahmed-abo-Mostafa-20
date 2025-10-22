// تحميل البيانات من localStorage
let news = JSON.parse(localStorage.getItem('news')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];

// تهيئة Particles.js للخلفية السحرية (جسيمات تاريخية مثل رماد أو نجوم)
particlesJS('particles-js', {
    particles: {
        number: { value: 30 }, // عدد أقل للحجم المتوسط
        color: { value: '#FFD700' }, // ذهبي
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 2 }, // حجم أصغر
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
            div.innerHTML += `<img src="${item.image}" width="150" height="100" alt="صورة الحدث">`; // عرض الصورة
        }
        newsList.appendChild(div);
    });
}

// تسجيل المستخدم (بدون رفع صورة)
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const status = document.getElementById('user-status').value;
    saveUser(name, email, status);
});

function saveUser(name, email, status) {
    users.push({ name, email, status });
    localStorage.setItem('users', JSON.stringify(users));
    displayUserInfo();
    document.getElementById('login-form').reset();
}

// عرض معلومات المستخدم
function displayUserInfo() {
    const userInfo = document.getElementById('user-info');
    userInfo.innerHTML = '';
    users.forEach(user => {
        const div = document.createElement('div');
        div.innerHTML = `<p>الاسم: ${user.name}, الحالة: ${user.status}</p>`;
        userInfo.appendChild(div);
    });
}

// إخفاء/إظهار قائمة التسجيل
document.getElementById('toggle-login').addEventListener('click', function() {
    const form = document.getElementById('login-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

// تحميل البيانات عند التحميل
window.onload = function() {
    displayNews();
    displayUserInfo();
};