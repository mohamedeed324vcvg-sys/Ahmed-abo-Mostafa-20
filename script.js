 // تحميل البيانات من localStorage
let news = JSON.parse(localStorage.getItem('news')) || [];
// مستخدم حالي
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// قائمة الإداريين المساعدين والمسؤولين (يمكن جلبها من مكان آمن في تطبيق حقيقي)
const ASSISTANT_EMAILS = ['assistant@example.com']; // ضع هنا إيميلات المساعدين
const ADMIN_EMAILS = ['admin@example.com', 'farespython2011@gmail.com']; // ضع هنا إيميلات المسؤولين

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
    news.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p>`;
        if (item.image) {
            div.innerHTML += `<img src="${item.image}" width="150" height="100" alt="صورة الحدث">`;
        }

        // 3D Tilt Effect Logic
        div.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = div.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const rotateX = (y - height / 2) / 10;
            const rotateY = (x - width / 2) / -10;
            div.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        div.addEventListener('mouseleave', () => {
            div.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });

        newsList.appendChild(div);
    });
}

// بيانات الشخصيات التاريخية
const characterData = {
    cleopatra: { title: 'كليوباترا السابعة', bio: 'آخر ملكة في سلالة البطالمة في مصر القديمة. اشتهرت بجمالها وذكائها وعلاقاتها مع يوليوس قيصر ومارك أنطونيو.' },
    napoleon: { title: 'نابليون بونابرت', bio: 'قائد عسكري ورجل دولة فرنسي، صعد إلى الصدارة خلال الثورة الفرنسية وقاد العديد من الحملات الناجحة خلال الحروب الثورية.' },
    alexander: { title: 'الإسكندر الأكبر', bio: 'ملك مملكة مقدونيا اليونانية القديمة. بحلول سن الثلاثين، أنشأ واحدة من أكبر الإمبراطوريات في العالم القديم.' },
    ramses: { title: 'رمسيس الثاني', bio: 'يُعتبر أحد أعظم فراعنة الإمبراطورية المصرية وأكثرهم شهرة وقوة. حكم لمدة 66 عامًا وترك وراءه إرثًا معماريًا هائلاً.' }
};




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
        document.getElementById('status-selection').style.display = 'block';
    }
}

// مساعدة لإظهار أو إخفاء زر الإدمن بناءً على الحالة
function updateAdminVisibility() {
    const adminBtn = document.getElementById('go-to-admin');
    if (!adminBtn) return;
    adminBtn.style.display = (currentUser && (currentUser.status === 'assistant' || currentUser.status === 'admin')) ? 'inline-block' : 'none';
}

// معالجة تسجيل الدخول بجوجل
function handleCredentialResponse(response) {
    // decodeJwtResponse function to decode the JWT
    function decodeJwtResponse(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    const responsePayload = decodeJwtResponse(response.credential);

    let status = 'student'; // Default status for Google users
    if (ADMIN_EMAILS.includes(responsePayload.email)) {
        status = 'admin';
    } else if (ASSISTANT_EMAILS.includes(responsePayload.email)) {
        status = 'assistant';
    }

    currentUser = {
        status: status,
        name: responsePayload.name,
        email: responsePayload.email,
        image: responsePayload.picture
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    // حفظ المستخدم في قائمة المستخدمين للإدمن
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(currentUser);
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('status-selection').style.display = 'none';
    document.querySelector('.g_id_signin').style.display = 'none';
    initializeUserSession();
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
                const password = document.getElementById('admin-password').value;
                if (password !== 'pop14') { // كلمة المرور الخاصة بالمساعد
                    alert('كلمة المرور خاطئة!');
                    return;
                }
            } else if (status === 'admin') {
                // يمكنك تغيير كلمة المرور للمسؤول هنا إذا أردت
                const passwordInput = document.getElementById('admin-password');
                const password = passwordInput ? passwordInput.value : '';
                if (password !== 'farespython2011') {
                    alert('كلمة المرور خاطئة!');
                    return;
                }
            }
            const name = document.getElementById('user-name').value;
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
                }
            } else {
                currentUser = { status, name, image: null };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                // حفظ المستخدم في قائمة المستخدمين للإدمن
                let users = JSON.parse(localStorage.getItem('users')) || [];
                users.push(currentUser);
                localStorage.setItem('users', JSON.stringify(users));
                displayUserInfo();
            }
            document.getElementById('status-selection').style.display = 'none';
            initializeUserSession();
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
            document.querySelector('.g_id_signin').style.display = 'block';
            logoutBtn.style.display = 'none';
            // إعادة تعيين واجهة اختيار الحالة
            const nameInput = document.getElementById('user-name'); // الاسم مطلوب للجميع
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
    function initializeUserSession() {
        updateAdminVisibility();
        const isLoggedIn = !!currentUser;
        document.getElementById('logout-btn').style.display = isLoggedIn ? 'inline-block' : 'none';
        document.getElementById('status-selection').style.display = isLoggedIn ? 'none' : 'block';
        document.querySelector('.g_id_signin').style.display = isLoggedIn ? 'none' : 'block';
        displayUserInfo(); // استدعاء هذه الدالة هنا لعرض معلومات المستخدم أو النموذج
    }
    // تهيئة الجلسة عند تحميل الصفحة
    initializeUserSession();

    // إضافة listener لتحديث الأحداث عند تغيير localStorage من صفحات أخرى
    window.addEventListener('storage', function(e) {
        if (e.key === 'news') {
            news = JSON.parse(localStorage.getItem('news')) || [];
            displayNews();
        }
    });

    // --- Modal Logic ---
    const modal = document.getElementById('character-modal');
    const closeButton = document.querySelector('.close-button');
    const figuresContainer = document.getElementById('historical-figures-container');

    if (figuresContainer) {
        figuresContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('figure')) {
                const characterKey = e.target.dataset.character;
                const data = characterData[characterKey];
                if (data) {
                    document.getElementById('modal-title').textContent = data.title;
                    document.getElementById('modal-bio').textContent = data.bio;
                    modal.style.display = 'block';
                }
            }
        });
    }

    closeButton.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
