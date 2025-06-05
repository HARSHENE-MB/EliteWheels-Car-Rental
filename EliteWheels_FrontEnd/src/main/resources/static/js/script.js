
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('car-search-form');
    
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        
        const location = document.getElementById('location').value;
        const pickupDate = document.getElementById('pickup-date').value;
        const carType = document.getElementById('car-type').value;
     
        if (!location || !pickupDate || !carType) {
            alert('Please fill in all search fields');
            return;
        }
        
      
        console.log('Search Parameters:', {
            location: location,
            pickupDate: pickupDate,
            carType: carType
        });
        
        
    });

    
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
           
            navLinks.forEach(l => l.classList.remove('active'));
            
            this.classList.add('active');
        });
    });

    const loginBtn = document.getElementById('login-btn');
    
    loginBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        
        console.log('Login button clicked');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const profileIcon = document.getElementById("profileIcon");
    const dropdownMenu = document.getElementById("profileDropdownMenu");
    const userNameDisplay = document.getElementById("userNameDisplay");

    const user = sessionStorage.getItem("user"); 

    dropdownMenu.innerHTML = "";

    if (user) {
        const parsedUser = JSON.parse(user); 

        
        userNameDisplay.textContent = parsedUser.firstName || "User";
        userNameDisplay.classList.remove("d-none");

    
        dropdownMenu.innerHTML = `
            <a href="/profile" class="dropdown-item">Profile</a>
            <a href="#" id="logoutButton" class="dropdown-item">Logout</a>
        `;
    } else {
       
        userNameDisplay.classList.add("d-none");

        dropdownMenu.innerHTML = `
            <a href="/login" class="dropdown-item">Login</a>
        `;
    }

    // logout
    dropdownMenu.addEventListener("click", function (e) {
        if (e.target && e.target.id === "logoutButton") {
            e.preventDefault();
            sessionStorage.clear();
            bootstrap.Dropdown.getOrCreateInstance(profileIcon).hide();
            window.location.href = "/login";
        }
    });
});
