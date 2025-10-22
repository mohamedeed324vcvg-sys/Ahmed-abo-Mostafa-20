// تحميل البيانات من localStorage
let news = JSON.parse(localStorage.getItem('news')) || [];
// مستخدم حالي مخزن كمفتاح بسيط (لا تسجيل بجوجل)
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// تهيئة Particles.js للخلفية
function initParticles() {
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
}

// عرض الأخبار كما كانت
function displayNews() {
    const newsList = document.getElementById('news-list');
    if (!newsList) return;
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

// عرض معلومات المستخدم الحالي
function displayUserInfo() {
    const userInfo = document.getElementById('user-info');
    if (!userInfo) return;
    userInfo.innerHTML = '';
    if (currentUser) {
        const div = document.createElement('div');
        div.innerHTML = `<p>الاسم: ${currentUser.name || 'غير محدد'}</p><p>الحالة الحالية: ${currentUser.status}</p>`;
        if (currentUser.image) {
            div.innerHTML += `<br><img src="${currentUser.image}" width="80" height="80" alt="صورة">`;
        }
        userInfo.appendChild(div);
    } else {
        userInfo.textContent = 'لم يتم اختيار حالة بعد.';
    }
}

// مساعدة لإظهار أو إخفاء زر الإدمن بناءً على الحالة
function updateAdminVisibility() {
    const adminBtn = document.getElementById('go-to-admin');
    if (!adminBtn) return;
    adminBtn.style.display = (currentUser && (currentUser.status === 'assistant' || currentUser.status === 'admin')) ? 'inline-block' : 'none';
}

// إظهار حقل الصورة إذا كان طالب أو كلمة المرور إذا كان إدمن مساعد أو مسؤول، وحقل الاسم للجميع
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'user-status') {
        const nameInput = document.getElementById('user-name');
        const imageInput = document.getElementById('student-image');
        const passwordInput = document.getElementById('admin-password');
        if (nameInput) nameInput.style.display = 'block'; // الاسم مطلوب للجميع
        if (e.target.value === 'student') {
            if (imageInput) imageInput.style.display = 'block';
            if (passwordInput) passwordInput.style.display = 'none';
        } else if (e.target.value === 'assistant' || e.target.value === 'admin') {
            if (imageInput) imageInput.style.display = 'none';
            if (passwordInput) passwordInput.style.display = 'block';
        } else {
            if (imageInput) imageInput.style.display = 'none';
            if (passwordInput) passwordInput.style.display = 'none';
        }
    }
});

// معالجة تأكيد الحالة
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    displayNews();

    const confirmBtn = document.getElementById('confirm-status');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const statusEl = document.getElementById('user-status');
            const status = statusEl ? statusEl.value : 'visitor';
            if (status === 'assistant') {
                const passwordInput = document.getElementById('admin-password');
                const password = passwordInput ? passwordInput.value : '';
                if (password !== 'pop14') {
                    alert('كلمة المرور خاطئة!');
                    return;
                }
            } else if (status === 'admin') {
                const passwordInput = document.getElementById('admin-password');
                const password = passwordInput ? passwordInput.value : '';
                if (password !== 'farespython2011') {
                    alert('كلمة المرور خاطئة!');
                    return;
                }
            }
            const nameInput = document.getElementById('user-name');
            const name = nameInput ? nameInput.value : '';
            if (!name) {
                alert('يرجى إدخال اسمك!');
                return;
            }
            if (status === 'student') {
                const fileInput = document.getElementById('student-image');
                if (fileInput && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function() {
                        currentUser = { status, name, image: reader.result };
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        // حفظ المستخدم في قائمة المستخدمين للإدمن
                        let users = JSON.parse(localStorage.getItem('users')) || [];
                        users.push(currentUser);
                        localStorage.setItem('users', JSON.stringify(users));
                        displayUserInfo();
                        updateAdminVisibility();
                        document.getElementById('logout-btn').style.display = 'inline-block';
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    currentUser = { status, name, image: null };
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    // حفظ المستخدم في قائمة المستخدمين للإدمن
                    let users = JSON.parse(localStorage.getItem('users')) || [];
                    users.push(currentUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    displayUserInfo();
                    updateAdminVisibility();
                    document.getElementById('logout-btn').style.display = 'inline-block';
                }
            } else {
                currentUser = { status, name, image: null };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                // حفظ المستخدم في قائمة المستخدمين للإدمن
                let users = JSON.parse(localStorage.getItem('users')) || [];
                users.push(currentUser);
                localStorage.setItem('users', JSON.stringify(users));
                displayUserInfo();
                updateAdminVisibility();
                document.getElementById('logout-btn').style.display = 'inline-block';
            }
        });
    }

    // زر تسجيل الخروج محلي بسيط
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            displayUserInfo();
            updateAdminVisibility();
            logoutBtn.style.display = 'none';
            // إعادة تعيين واجهة اختيار الحالة
            const nameInput = document.getElementById('user-name');
            if (nameInput) {
                nameInput.value = '';
                nameInput.style.display = 'block'; // الاسم مطلوب للجميع
            }
            const imageInput = document.getElementById('student-image');
            if (imageInput) {
                imageInput.value = '';
                imageInput.style.display = 'none';
            }
            const passwordInput = document.getElementById('admin-password');
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.style.display = 'none';
            }
            const statusEl = document.getElementById('user-status');
            if (statusEl) statusEl.value = 'visitor';
        });
    }

// تهيئة العرض عند التحميل إذا كان هناك مستخدم محفوظ
    if (currentUser) {
        displayUserInfo();
        updateAdminVisibility();
        document.getElementById('logout-btn').style.display = 'inline-block';
    }

    // إضافة listener لتحديث الأحداث عند تغيير localStorage من صفحات أخرى
    window.addEventListener('storage', function(e) {
        if (e.key === 'news') {
            news = JSON.parse(localStorage.getItem('news')) || [];
            displayNews();
        }
    });
});
