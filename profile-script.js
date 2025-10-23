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

// عرض معلومات المستخدم الحالي
function displayProfile() {
    const profileCard = document.getElementById('profile-card');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        let title = 'الزائر';
        switch(currentUser.status) {
            case 'student': title = 'المؤرخ الشاب'; break;
            case 'assistant': title = 'مساعد المؤرخ'; break;
            case 'admin': title = 'كبير المؤرخين'; break;
        }

        let profileHTML = `
            <h2>${title} ${currentUser.name}</h2>
            <p><strong>الرتبة:</strong> ${currentUser.status}</p>
        `;
        if (currentUser.email) {
            profileHTML += `<p><strong>البريد:</strong> ${currentUser.email}</p>`;
        }
        if (currentUser.image) {
            profileHTML += `<img src="${currentUser.image}" width="100" height="100" alt="صورتك الشخصية" style="border-radius: 50%; border: 3px solid gold; margin-top: 10px;">`;
        }
        profileCard.innerHTML = profileHTML;
    } else {
        profileCard.innerHTML = `
            <h2>أيها الرحالة المجهول</h2>
            <p>لا توجد معلومات عنك في سجلاتنا. يرجى تسجيل هويتك في الصفحة الرئيسية لتنضم إلى رحلتنا عبر التاريخ.</p>
        `;
    }
}

window.onload = displayProfile;
