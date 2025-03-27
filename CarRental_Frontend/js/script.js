// Search Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('car-search-form');
    
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const location = document.getElementById('location').value;
        const pickupDate = document.getElementById('pickup-date').value;
        const carType = document.getElementById('car-type').value;
        
        // Validate form
        if (!location || !pickupDate || !carType) {
            alert('Please fill in all search fields');
            return;
        }
        
        // Perform search (replace with actual search logic)
        console.log('Search Parameters:', {
            location: location,
            pickupDate: pickupDate,
            carType: carType
        });
        
        // Redirect or display search results
        // window.location.href = '/search-results.html';
    });

    // Navigation Active State
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Login Button Click Handler
    const loginBtn = document.getElementById('login-btn');
    
    loginBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Redirect to login page or open login modal
        // window.location.href = '/login.html';
        console.log('Login button clicked');
    });
});