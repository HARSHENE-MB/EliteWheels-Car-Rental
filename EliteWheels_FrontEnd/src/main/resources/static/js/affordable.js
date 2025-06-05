
    let cars = []; 
    async function fetchCars() {
        try {
            const response = await fetch("http://localhost:8081/api/cars/category/1");
            const data = await response.json();
            cars = data.map(car => ({
				carId: car.carId,
                model: car.model,
                brand: car.brand.brandName,
                seats: car.seatCount,
                price: car.rentalRate,
                rentalType: 'Hourly', 
                category: car.type.typeName,
                image: '/assets/' + car.imageUrl 
            }));
            displayCars('all');
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    }

    function displayCars(categoryOrFilteredCars) {
        const container = document.getElementById('carsContainer');
        container.innerHTML = '';

        let carsToShow = Array.isArray(categoryOrFilteredCars)
            ? categoryOrFilteredCars
            : categoryOrFilteredCars === 'all'
                ? cars
                : cars.filter(car => car.category === categoryOrFilteredCars);

        carsToShow.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'col-md-4 mb-4';
            carCard.innerHTML = `
                <div class="card car-card position-relative shadow-lg rounded-4 overflow-hidden">
                    <div class="image">
                        <img src="${car.image}" class="card-img-top car-image" alt="${car.brand} ${car.model}">
                    </div>
                    <div class="card-body text-center">
                        <h5 class="card-title mb-1">${car.model}</h5>
                        <p class="car-seats text-muted">
                            <i class="fas fa-users me-2"></i>${car.seats} Seats
                        </p>
                        <h4 class="price mb-2">
                            <span class="fw-bold" style="font-size: 28px;color:#183B4E">₹${car.price}</span>/${car.rentalType}
                        </h4>
                        <p class="features text-success"><i class="fas fa-check-circle"></i> Free Delivery</p>
                        <p class="features text-success"><i class="fas fa-check-circle"></i> Insurance Included</p>
                    </div>
					<div class="view-car btn btn-dark w-100" data-id="${car.carId}" data-bs-toggle="modal" data-bs-target="#carDetailModal">
					            View Car
					        </div>
                </div>
            `;
            container.appendChild(carCard);
        });
    }
	
	let selectedCar = null;
	document.addEventListener('DOMContentLoaded', () => {

	   
	    document.addEventListener('click', async function (e) {
	        if (e.target.classList.contains('view-car')) {
	            const carId = e.target.getAttribute('data-id');

	            try {
	                const response = await fetch(`http://localhost:8081/api/cars/${carId}`);
	                if (!response.ok) throw new Error("Failed to fetch car");

	                const car = await response.json();
	                selectedCar = car;

	                const modalBody = document.getElementById("carDetailBody");
	                modalBody.innerHTML = `
	                    <div class="row g-4">
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

					const modalElement = document.getElementById('carDetailModal');
					const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
					modal.show();

					

	            } catch (err) {
	                console.error("Error loading car details for modal:", err);
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


    // Filter by category (radio tabs)
    document.querySelectorAll('.radio-inputs .radio input').forEach(tab => {
        tab.addEventListener('change', function () {
            displayCars(this.getAttribute('data-category'));
        });
    });
	
	function getSelectedRadio(name) {
	        const selected = document.querySelector(`input[name="${name}"]:checked`);
	        return selected ? selected.value : null;
	    }

		
		function applyFilters() {
		    const selectedBrand = document.querySelector('.brand-images img.selected')?.dataset.brand;
		    // console.log(selectedBrand);

		    const selectedSeats = getSelectedRadio("seats");
			console.log(selectedSeats);
		    const selectedRentalType = getSelectedRadio("rentalType");
		    const priceLimit = document.getElementById("priceRangeFilter").value;
			// cars.forEach(car => console.log(car.brand));

		    const filteredCars = cars.filter(car =>
		        (!selectedBrand || car.brand.toLowerCase() === selectedBrand.toLowerCase()) &&
		        (selectedSeats === "all" || Number(car.seats) === Number(selectedSeats)) &&
		        (!selectedRentalType || car.rentalType.toLowerCase() === selectedRentalType.toLowerCase()) &&
		        Number(car.price) <= Number(priceLimit)
		    );

		    displayCars(filteredCars);
		}


			
			// Brand image click selection
			   document.querySelectorAll('.brand-images img').forEach(img => {
			       img.addEventListener('click', () => {
			           // Remove selected class from all
			           document.querySelectorAll('.brand-images img').forEach(i => i.classList.remove('selected'));
			           // Add selected class to clicked one
			           img.classList.add('selected');
			           applyFilters();
			       });
			   });

			   
			   document.querySelectorAll('input[type="radio"][name="seats"], input[type="radio"][name="rentalType"]').forEach(input => {
			       input.addEventListener('change', applyFilters);
			   });

			   document.getElementById('priceRangeFilter').addEventListener('input', (e) => {
			       document.getElementById('priceDisplay').textContent = `Max Price: ₹${e.target.value}`;
			       applyFilters();
			   });

			 
			   document.getElementById('applyFilters').addEventListener('click', () => {
			       
			       document.querySelector('input[name="seats"][value="4"]').checked = true;
			       document.querySelector('input[name="rentalType"][value="hourly"]').checked = true;

			       document.querySelectorAll('.brand-images img').forEach(img => img.classList.remove('selected'));

			       const priceSlider = document.getElementById("priceRangeFilter");
			       priceSlider.value = 100000;
			       document.getElementById("priceDisplay").textContent = `Max Price: ₹${priceSlider.value}`;

			       applyFilters();
			   });

    const sparkle = document.querySelector(".headlight-sparkle");
    if (sparkle) {
        setInterval(() => {
            const randomScale = 1.8 + Math.random() * 0.4;
            const randomBlur = 10 + Math.random() * 6;
            sparkle.style.transform = `scale(${randomScale})`;
            sparkle.style.filter = `blur(${randomBlur}px)`;
        }, 400);
    }
	
	

    window.addEventListener('DOMContentLoaded', fetchCars);
	
	
	
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

