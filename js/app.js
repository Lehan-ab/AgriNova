document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('agrinova_user'));
    const loginBtns = document.querySelectorAll('.login-btn');
    const signupBtns = document.querySelectorAll('.signup-btn');

    // Update navbar buttons based on auth state
    if (currentUser) {
        loginBtns.forEach(btn => {
            btn.innerHTML = `<i class="fas fa-user-circle mr-1"></i> Dashboard`;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Preclude auth modal binding
                if (currentUser.role === 'farmer') window.location.href = 'farmer-dashboard.html';
                else if (currentUser.role === 'supplier') window.location.href = 'supplier-dashboard.html';
                else if (currentUser.role === 'admin') window.location.href = 'admin.html';
            });
        });

        signupBtns.forEach(btn => {
            btn.classList.add('hidden');
        });
    }

    // Role-based route protection
    const path = window.location.pathname;
    if (path.includes('dashboard') || path.includes('messages') || path.includes('booking') || path.includes('admin')) {
        if (!currentUser) {
            window.location.href = 'index.html';
        }
    }

    // Logout handling
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('agrinova_user');
            window.location.href = 'index.html';
        });
    }

    // Current User Display
    const userNameDisplays = document.querySelectorAll('.user-name-display');
    if (currentUser && userNameDisplays.length > 0) {
        userNameDisplays.forEach(el => el.textContent = currentUser.name);
    }
});

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-primary' : (type === 'error' ? 'bg-red-500' : 'bg-gray-800');
    toast.className = `fixed bottom-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl fade-in z-[100] flex items-center gap-3`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
