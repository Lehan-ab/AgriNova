function openAuthModal() {
    const modalHTML = `
    <div id="authModal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[100] fade-in p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition">
                <i class="fas fa-times"></i>
            </button>
            <div class="text-center mb-6">
                <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                    <i class="fas fa-leaf"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Welcome to Agrinova</h2>
                <p class="text-sm text-gray-500 mt-1">Sign in to connect with trusted services.</p>
            </div>
            
            <div class="flex border-b border-gray-200 mb-6">
                <button id="tabLogin" class="flex-1 pb-3 text-center text-primary border-b-2 border-primary font-semibold transition">Login</button>
                <button id="tabSignup" class="flex-1 pb-3 text-center text-gray-500 border-b-2 border-transparent font-medium hover:text-gray-700 transition">Sign Up</button>
            </div>

            <form id="authForm" class="space-y-5">
                <div id="roleSelectGroup" class="hidden">
                    <label class="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
                    <div class="grid grid-cols-2 gap-3">
                        <label class="border rounded-lg p-3 flexitems-center justify-center cursor-pointer hover:bg-gray-50 transition peer-checked:border-primary flex items-center gap-2">
                            <input type="radio" name="role" value="farmer" checked class="text-primary focus:ring-primary h-4 w-4">
                            <span class="text-sm font-medium">Farmer</span>
                        </label>
                        <label class="border rounded-lg p-3 flexitems-center justify-center cursor-pointer hover:bg-gray-50 transition flex items-center gap-2">
                            <input type="radio" name="role" value="supplier" class="text-primary focus:ring-primary h-4 w-4">
                            <span class="text-sm font-medium">Supplier</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><i class="fas fa-phone-alt"></i></span>
                        <input type="tel" id="phone" required class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition" placeholder="07X XXXXXXX">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><i class="fas fa-lock"></i></span>
                        <input type="password" id="password" required class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition" placeholder="••••••••">
                    </div>
                </div>
                
                <div class="text-xs text-center text-gray-400 mt-2 p-2 bg-gray-50 rounded">Demo hint: user 'admin' to access admin panel.</div>

                <button type="submit" class="w-full bg-primary hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2">
                    <span id="btnText">Login</span> <i class="fas fa-arrow-right"></i>
                </button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    let isSignup = false;

    document.getElementById('tabLogin').addEventListener('click', (e) => {
        isSignup = false;
        e.target.classList.add('border-primary', 'text-primary', 'font-semibold');
        e.target.classList.remove('border-transparent', 'text-gray-500', 'font-medium');
        const signupBtn = document.getElementById('tabSignup');
        signupBtn.classList.remove('border-primary', 'text-primary', 'font-semibold');
        signupBtn.classList.add('border-transparent', 'text-gray-500', 'font-medium');
        document.getElementById('roleSelectGroup').classList.add('hidden');
        document.getElementById('btnText').textContent = 'Login';
    });

    document.getElementById('tabSignup').addEventListener('click', (e) => {
        isSignup = true;
        e.target.classList.add('border-primary', 'text-primary', 'font-semibold');
        e.target.classList.remove('border-transparent', 'text-gray-500', 'font-medium');
        const loginBtn = document.getElementById('tabLogin');
        loginBtn.classList.remove('border-primary', 'text-primary', 'font-semibold');
        loginBtn.classList.add('border-transparent', 'text-gray-500', 'font-medium');
        document.getElementById('roleSelectGroup').classList.remove('hidden');
        document.getElementById('btnText').textContent = 'Create Account';
    });

    document.getElementById('authForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        if (phone === 'admin') {
            localStorage.setItem('agrinova_user', JSON.stringify({ role: 'admin', phone, name: 'Admin User' }));
            window.location.href = 'admin.html';
            return;
        }

        if (isSignup) {
            const role = document.querySelector('input[name="role"]:checked').value;
            const newUser = { role, phone, password, name: role === 'farmer' ? 'New Farmer' : 'New Supplier' };
            await db.users.add(newUser);
            localStorage.setItem('agrinova_user', JSON.stringify(newUser));
            window.location.href = role === 'farmer' ? 'farmer-dashboard.html' : 'supplier-dashboard.html';
        } else {
            const user = await db.users.where({ phone }).first();
            if (user && user.password === password) {
                localStorage.setItem('agrinova_user', JSON.stringify(user));
                window.location.href = user.role === 'farmer' ? 'farmer-dashboard.html' : 'supplier-dashboard.html';
            } else {
                const defaultRole = phone.includes('sup') ? 'supplier' : 'farmer';
                localStorage.setItem('agrinova_user', JSON.stringify({ role: defaultRole, phone, name: 'Demo User' }));
                window.location.href = defaultRole === 'farmer' ? 'farmer-dashboard.html' : 'supplier-dashboard.html';
            }
        }
    });
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.remove();
}

document.addEventListener('DOMContentLoaded', () => {
    const loginBtns = document.querySelectorAll('.login-btn, .signup-btn');
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentUser = JSON.parse(localStorage.getItem('agrinova_user'));
            if (!currentUser) openAuthModal();
        });
    });
});
