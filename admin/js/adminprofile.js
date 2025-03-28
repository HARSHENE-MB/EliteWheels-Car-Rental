document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
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

    // Logout button functionality (for demo purposes)
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', () => {
        alert('Logging out...');
        // In a real application, you would redirect to a logout endpoint or clear session data
        // window.location.href = '/logout';
    });
});