// تحميل البيانات من localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

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

// عرض معلومات الطالب (الأخير المسجل)
function displayProfile() {
    const profileCard = document.getElementById('profile-card');
    if (users.length > 0) {
        const user = users[users.length - 1]; // آخر مسجل
        profileCard.innerHTML = `
            <h2>مرحباً ${user.name}!</h2>
            <p><strong>البريد:</strong> ${user.email}</p>
            <p><strong>الحالة:</strong> ${user.status}</p>
        `;
    } else {
        profileCard.innerHTML = '<p>لا توجد معلومات. سجل أولاً في الصفحة الرئيسية.</p>';
    }
}

window.onload = displayProfile;