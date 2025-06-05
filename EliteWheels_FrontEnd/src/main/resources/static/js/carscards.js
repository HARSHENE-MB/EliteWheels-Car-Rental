function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 20 + 10;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            
            document.getElementById('particles').appendChild(particle);
            
            setTimeout(() => particle.remove(), 15000);
        }

        // Generate particles every 500ms
        setInterval(createParticle, 500);
		
		
		function goToAffordablePage() {
		        window.location.href = "/affordable";
		    }
			
			function goToLuxuryePage() {
					        window.location.href = "/luxury";
					    }
						
						
						
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
