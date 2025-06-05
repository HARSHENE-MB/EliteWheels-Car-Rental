let isLoggedIn = sessionStorage.getItem("user") !== null;

class OfferHandler {
    constructor() {
        this.offerButtons = document.querySelectorAll('.offer-btn');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.offerButtons.forEach(button => {
            button.addEventListener('click', this.handleOfferClick.bind(this));
        });
    }

    handleOfferClick(event) {
        const offerName = event.target.getAttribute('data-offer');

        if (!isLoggedIn) {
            this.showLoginPrompt(offerName);
        } else {
            this.showSuccessMessage(offerName);
        }
    }

    showLoginPrompt(offerName) {
        Swal.fire({
            title: 'Login Required',
            text: `Please log in to claim the "${offerName}" offer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Login Now',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d4af37',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'login';
            }
        });
    }

    showSuccessMessage(offerName) {
    Swal.fire({
        title: 'Offer Claimed',
        text: `You’ve successfully claimed the "${offerName}" offer. Check your profile for details.`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d4af37'
    });
}
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const offerHandler = new OfferHandler();
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
