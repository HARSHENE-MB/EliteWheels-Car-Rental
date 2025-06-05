function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 15 + 5; 
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}%`; 
            particle.style.bottom = '0'; 
            
           
            const duration = Math.random() * 6 + 4;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${Math.random() * 2}s`; 
            
            document.getElementById('particles').appendChild(particle);
            
            
            setTimeout(() => particle.remove(), duration * 1000);
        }

        
        setInterval(createParticle, 300);
		
		document.addEventListener("DOMContentLoaded", () => {
		    document.body.addEventListener("click", async (e) => {
		        if (e.target.classList.contains("btn-view")) {
		            e.preventDefault();

		            const carId = e.target.getAttribute("data-id");

		            try {
		                const response = await fetch(`http://localhost:8081/api/cars/${carId}`);
						const car = await response.json();
						selectedCar = car;

		                const modalBody = document.getElementById("carDetailBody");
		                modalBody.innerHTML = `
		                    <div class="row g-4 text-dark">
		                        <div class="col-md-6">
		                            <img src="/assets/${car.imageUrl}" class="img-fluid rounded-3 shadow-sm" alt="${car.model}">
		                            <br><hr>
		                            <p class="text-muted fs-6" style="line-height: 1.8;">
		                                Introducing the <strong>${car.brand.brandName} ${car.model}</strong>, a premium ${car.type.typeName} launched in <strong>${car.year}</strong>,
		                                designed for both comfort and performance. With <strong>${car.seatCount}</strong> seats and a mileage of
		                                <strong>${car.mileage.toLocaleString()} km</strong>, this vehicle offers a smooth ride enhanced by features like
		                                <strong>${car.features}</strong>. Ideal for city commutes and long trips alike.
		                            </p>
		                        </div>
		                        <div class="col-md-6 ps-md-5">
		                            <h4 class="mb-3">${car.brand.brandName} ${car.model} <span class="text-muted">(${car.year})</span></h4>
		                            <hr><br>
		                            <p><strong>Vehicle No:</strong> ${car.vehicleNo}</p>
		                            <p><strong>Year:</strong> ${car.year}</p>
		                            <p><strong>Type:</strong> ${car.type.typeName}</p>
		                            <p><strong>Category:</strong> ${car.category.categoryName}</p>
		                            <p><strong>Seats:</strong> ${car.seatCount}</p>
		                            <p><strong>Mileage:</strong> ${car.mileage} km</p>
		                            <p><strong>Features:</strong> ${car.features}</p>
		                            <p><strong>Price:</strong> ₹${car.rentalRate}/hour</p>
		                            <span class="badge bg-success">${car.status}</span>
		                        </div>
		                    </div>
		                `;

		                const modal = new bootstrap.Modal(document.getElementById("carDetailModal"));
		                modal.show();

		            } catch (err) {
		                console.error("Error loading car details:", err);
		                alert("Failed to load car details.");
		            }
		        }
		    });
			
		
				    const rentNowBtn = document.getElementById('rentNowBtn');
				    rentNowBtn.addEventListener('click', () => {
				        if (!selectedCar) {
				            alert("No car selected.");
				            return;
				        }

				        sessionStorage.setItem("selectedCar", JSON.stringify(selectedCar));

				        const user = sessionStorage.getItem("user");
				        if (user) {
				            window.location.href = "/payment";
				        } else {
				            window.location.href = "/login";
				        }
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
		
		
		
		

