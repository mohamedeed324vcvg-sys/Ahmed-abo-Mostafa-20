// تحميل البيانات من localStorage
let news = JSON.parse(localStorage.getItem('news')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];

// متغيرات لتخزين بيانات المستخدم من جوجل مؤقتاً
let googleUserData = null;

// تهيئة Particles.js للخلفية السحرية (جسيمات تاريخية مثل رماد أو نجوم)
function initParticles() {
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
}

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

// دالة معالجة استجابة جوجل
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    googleUserData = {
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture
    };
    // إظهار نموذج اختيار الحالة
    document.getElementById('status-selection').style.display = 'block';
    // إخفاء زر جوجل
    document.getElementById('g_id_signin').style.display = 'none';
}

// دالة فك تشفير JWT
function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
// تأكيد الحالة بعد اختيارها
// سيتم إضافة مستمع الحدث داخل DOMContentLoaded لضمان وجود عناصر DOM قبل الربط
    };

function saveUser(name, email, status, image) {
    users.push({ name, email, status, image });
    localStorage.setItem('users', JSON.stringify(users));
    displayUserInfo();
    // إظهار زر تسجيل الخروج
    document.getElementById('logout-btn').style.display = 'block';
    // إخفاء نموذج اختيار الحالة
    document.getElementById('status-selection').style.display = 'none';
}

// إعادة تعيين قسم التسجيل
function resetLogin() {
    document.getElementById('status-selection').style.display = 'none';
    document.getElementById('g_id_signin').style.display = 'block';
    googleUserData = null;
    document.getElementById('user-status').value = 'visitor';
    document.getElementById('student-image').value = '';
    document.getElementById('student-image').style.display = 'none';
}

// عرض معلومات المستخدم
function displayUserInfo() {
    const userInfo = document.getElementById('user-info');
    userInfo.innerHTML = '';
    users.forEach(user => {
        const div = document.createElement('div');
        div.innerHTML = `<p>الاسم: ${user.name}, الحالة: ${user.status}</p>`;
        if (user.image) {
            div.innerHTML += `<img src="${user.image}" width="50" height="50" alt="صورة الطالب">`;
        }
        userInfo.appendChild(div);
    });
}

// إظهار حقل الصورة إذا كان طالب
document.getElementById('user-status').addEventListener('change', function() {
    const imageInput = document.getElementById('student-image');
    imageInput.style.display = this.value === 'student' ? 'block' : 'none';
});

// دالة تسجيل الخروج
document.getElementById('logout-btn').addEventListener('click', function() {
    // إلغاء الجلسة من جوجل إذا كان هناك بريد وكائن google متاح لتجنب أخطاء عند عدم تحميل مكتبة جوجل
    if (googleUserData && googleUserData.email && window.google && google.accounts && google.accounts.id) {
        google.accounts.id.revoke(googleUserData.email, () => {
            console.log('Google session revoked');
        });
    }
    // مسح بيانات الجلسة المحلية
    googleUserData = null;
    if (googleUserData && googleUserData.email) {
        google.accounts.id.revoke(googleUserData.email, done => {
            console.log('Google session revoked');
        });
    }
    // إعادة تعيين الواجهة
    resetLogin();
    // إخفاء زر تسجيل الخروج
    document.getElementById('logout-btn').style.display = 'none';
    // مسح بيانات المستخدم الحالي
// إعداد كل التفاعلات التي تتطلب عناصر DOM بعد تحميل الوثيقة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة Particles بعد تأكد وجود العنصر
    initParticles();

    // ربط زر تأكيد الحالة إذا كان موجوداً
    const confirmBtn = document.getElementById('confirm-status');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const statusEl = document.getElementById('user-status');
            const status = statusEl ? statusEl.value : 'visitor';
            let image = null;
            if (status === 'student') {
                const fileInput = document.getElementById('student-image');
                if (fileInput && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function() {
                        image = reader.result;
                        if (googleUserData) {
                            saveUser(googleUserData.name, googleUserData.email, status, image);
                        }
                        resetLogin();
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    if (googleUserData) {
                        saveUser(googleUserData.name, googleUserData.email, status, null);
                    }
                    resetLogin();
                }
            } else {
                if (googleUserData) {
                    saveUser(googleUserData.name, googleUserData.email, status, null);
                }
                resetLogin();
            }
        });
    }

    // إظهار حقل الصورة إذا كان طالب
    const userStatusEl = document.getElementById('user-status');
    if (userStatusEl) {
        userStatusEl.addEventListener('change', function() {
            const imageInput = document.getElementById('student-image');
            if (imageInput) {
                imageInput.style.display = this.value === 'student' ? 'block' : 'none';
            }
        });
    }

    // دالة تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // إلغاء الجلسة من جوجل إذا كان هناك بريد
            if (googleUserData && googleUserData.email && window.google && google.accounts && google.accounts.id) {
                google.accounts.id.revoke(googleUserData.email, done => {
                    console.log('Google session revoked');
                });
            }
            // إعادة تعيين الواجهة
            resetLogin();
            // إخفاء زر تسجيل الخروج
            logoutBtn.style.display = 'none';
            // مسح بيانات المستخدم الحالي
            googleUserData = null;
            // إعادة تحميل الصفحة لإعادة تهيئة جوجل
            location.reload();
            // ملاحظة: لا نحذف المستخدمين من localStorage، فقط نعيد تعيين الواجهة
        });
    }

    // تحميل البيانات عند التحميل
    displayNews();
    displayUserInfo();
});
    // إعادة تحميل الصفحة لإعادة تهيئة جوجل
    location.reload();
    // ملاحظة: لا نحذف المستخدمين من localStorage، فقط نعيد تعيين الواجهة
});
