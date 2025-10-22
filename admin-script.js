// تحميل البيانات من localStorage
let news = JSON.parse(localStorage.getItem('news')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let adminType = ''; // نوع الإدمن

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

// تسجيل دخول الإدمن
document.getElementById('login-admin-btn').addEventListener('click', function() {
    const password = document.getElementById('admin-password').value;
    if (password === 'pop14') {
        adminType = 'assistant';
        showAdminFeatures();
        alert('مرحباً يا إدمن مساعد! يمكنك إضافة الأحداث.');
    } else if (password === 'farespython2011') {
        adminType = 'responsible';
        showAdminFeatures();
        document.getElementById('user-list').style.display = 'block';
        document.getElementById('delete-news').style.display = 'block';
        document.getElementById('send-email-form').style.display = 'block';
        document.getElementById('remove-assistant').style.display = 'block';
        alert('مرحباً يا إدمن مسئول! لديك جميع الصلاحيات.');
    } else {
        alert('كلمة مرور خاطئة!');
    }
});

function showAdminFeatures() {
    document.getElementById('add-news-form').style.display = 'block';
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('back-to-main').style.display = 'block';
    displayUsers();
    displayNewsForDelete();
}

// عرض المستخدمين التفصيلي (حقيقي)
function displayUsers() {
    const usersDisplay = document.getElementById('users-display');
    usersDisplay.innerHTML = '';
    users.forEach(user => {
        let userHtml = `<p><strong>الاسم:</strong> ${user.name}, <strong>البريد:</strong> ${user.email}, <strong>الحالة:</strong> ${user.status}</p>`;
        if (user.image) {
            userHtml += `<img src="${user.image}" width="50" height="50" alt="صورة المستخدم">`;
        }
        usersDisplay.innerHTML += userHtml;
    });
}

// عرض الأحداث للحذف (للمسؤول فقط)
function displayNewsForDelete() {
    const newsDeleteList = document.getElementById('news-delete-list');
    newsDeleteList.innerHTML = '';
    news.forEach((item, index) => {
        const div = document.createElement('div');
        div.innerHTML = `<h4>${item.title}</h4><p>${item.content}</p><button onclick="deleteNews(${index})">حذف</button>`;
        newsDeleteList.appendChild(div);
    });
}

// حذف حدث (للمسؤول فقط)
function deleteNews(index) {
    if (adminType !== 'responsible') {
        alert('غير مسموح لك!');
        return;
    }
    news.splice(index, 1);
    localStorage.setItem('news', JSON.stringify(news));
    displayNewsForDelete();
    alert('تم حذف الحدث!');
}

// إضافة حدث
document.getElementById('add-news-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('news-title').value;
    const content = document.getElementById('news-content').value;
    const fileInput = document.getElementById('news-image');
    let image = null;
    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function() {
            image = reader.result;
            saveNews(title, content, image);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveNews(title, content, null);
    }
});

function saveNews(title, content, image) {
    news.push({ title, content, image });
    localStorage.setItem('news', JSON.stringify(news));
    alert('تم إضافة الحدث!');
    window.location.href = 'index.html'; // العودة التلقائية
}

// إرسال بريد (محاكاة)
document.getElementById('send-email-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const recipient = document.getElementById('email-recipient').value;
    const subject = document.getElementById('email-subject').value;
    const body = document.getElementById('email-body') ? document.getElementById('email-body').value : '';

    // محاكاة إرسال البريد: استبدل هذه الجزئية بمنطق إرسال البريد الحقيقي إذا لزم
    console.log('Simulated email send:', { to: recipient, subject: subject, body: body });
    alert('تم إرسال البريد بنجاح (محاكاة) إلى: ' + recipient + '.');

});