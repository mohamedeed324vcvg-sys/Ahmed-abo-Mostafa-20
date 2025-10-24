// تحميل البيانات من الخادم
let news = [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let adminType = ''; // نوع الإدمن

// إضافة listeners لتحديث البيانات عند تغيير localStorage من صفحات أخرى
window.addEventListener('storage', function(e) {
    if (e.key === 'users') {
        users = JSON.parse(localStorage.getItem('users')) || [];
        displayUsers();
    } else if (e.key === 'news') {
        // Reload news from server
        fetch('get_events.php')
            .then(response => response.json())
            .then(data => {
                news = data;
                displayNewsForDelete();
            })
            .catch(error => {
                console.error('Error loading news:', error);
                news = JSON.parse(localStorage.getItem('news')) || [];
                displayNewsForDelete();
            });
    }
});

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

// التحقق من نوع الإدمن من localStorage إذا كان مسجلاً دخولاً من index.html
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser && currentUser.status === 'admin') {
    adminType = 'responsible';
    showAdminFeatures();
    document.getElementById('user-list').style.display = 'block';
    document.getElementById('delete-news').style.display = 'block';
    document.getElementById('send-email-form').style.display = 'block';
    document.getElementById('remove-assistant').style.display = 'block';
    document.getElementById('admin-login').style.display = 'none';
    alert('مرحباً يا إدمن مسئول! لديك جميع الصلاحيات.');
} else if (currentUser && currentUser.status === 'assistant') {
    adminType = 'assistant';
    showAdminFeatures();
    document.getElementById('admin-login').style.display = 'none';
    alert('مرحباً يا إدمن مساعد! يمكنك إضافة الأحداث.');
}

function showAdminFeatures() {
    document.getElementById('add-news-form').style.display = 'block';
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('back-to-main').style.display = 'block';
    displayUsers();
    // Load news from server
    fetch('get_events.php')
        .then(response => response.json())
        .then(data => {
            news = data;
            displayNewsForDelete();
        })
        .catch(error => {
            console.error('Error loading news:', error);
            news = JSON.parse(localStorage.getItem('news')) || [];
            displayNewsForDelete();
        });
}

// عرض المستخدمين التفصيلي (حقيقي)
function displayUsers() {
    const usersDisplay = document.getElementById('users-display');
    usersDisplay.innerHTML = '';
    users.forEach(user => {
        let userHtml = `<p><strong>الاسم:</strong> ${user.name || 'غير محدد'}, <strong>الحالة:</strong> ${user.status}</p>`;
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
    // Send to server
    fetch('add_event.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, image })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            news.push({ title, content, image });
            localStorage.setItem('news', JSON.stringify(news));
            // Clear form
            document.getElementById('news-title').value = '';
            document.getElementById('news-content').value = '';
            document.getElementById('news-image').value = '';
            displayNewsForDelete(); // Refresh the list of news to delete
            alert('تم إضافة الحدث!');
        } else {
            alert('فشل في إضافة الحدث: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء إضافة الحدث.');
    });
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
