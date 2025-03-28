document.addEventListener('DOMContentLoaded', () => {
    // Predefined admin credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const usernameError = document.getElementById('usernameError');
            const passwordError = document.getElementById('passwordError');

            // Reset error messages
            usernameError.textContent = '';
            passwordError.textContent = '';

            // Validation flags
            let isValid = true;

            // Empty field validation
            if (!username) {
                usernameError.textContent = 'Username is required.';
                isValid = false;
            }
            if (!password) {
                passwordError.textContent = 'Password is required.';
                isValid = false;
            }

            // If fields are not empty, validate credentials
            if (isValid) {
                if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
                    passwordError.textContent = 'Invalid username or password.';
                    isValid = false;
                }
            }

            // If all validations pass, redirect to admin dashboard
            if (isValid) {
                // In a real application, you would set a session token here
                localStorage.setItem('isLoggedIn', 'true'); // Simple client-side auth simulation
                window.location.href = 'adminDashboard.html';
            }
        });
    }

    // Password visibility toggle (for profile page)
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const input = icon.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // Logout button functionality (for profile page and dashboard)
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn'); // Clear login state
            alert('Logging out...');
            window.location.href = 'login.html';
        });
    }

    // Profile form submission (for profile page)
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Profile updated successfully!');
            // In a real application, you would send the data to a server
            // Example: fetch('/update-profile', { method: 'POST', body: new FormData(profileForm) });
        });
    }

    // Password form submission (for profile page)
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const oldPassword = document.getElementById('old-password').value;
            const newPassword = document.getElementById('new-password').value;

            if (oldPassword && newPassword) {
                alert('Password updated successfully!');
                // In a real application, you would send the data to a server
                // Example: fetch('/change-password', { method: 'POST', body: JSON.stringify({ oldPassword, newPassword }) });
            } else {
                alert('Please fill in both password fields.');
            }
        });
    }

    // Protect admin pages (dashboard and profile) by checking login state
    if (window.location.pathname.includes('admindashboard.html') || window.location.pathname.includes('index.html')) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            window.location.href = 'adminlogin.html';
        }
    }
});