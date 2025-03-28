const cars = [
    {
        brand: 'Toyota',
        model: 'Camry',
        seats: 5,
        rentalType: 'daily',
        price: 75000,
        category: 'sports',
        image: './assets/Images/audi Q8-front.avif'
    },
    {
        brand: 'BMW',
        model: 'X5',
        seats: 5,
        rentalType: 'daily',
        price: 20000,
        category: 'sports',
        image: './assets/Images/BMW X5-front.avif'
    },
    {
        brand: 'Mercedes',
        model: 'E-Class',
        seats: 4,
        rentalType: 'hourly',
        price: 15000,
        category: 'luxury',
        image: './assets/Images/Mercedes-Benz GLS-front.avif'
    },
    {
        brand: 'Tesla',
        model: 'Model 3',
        seats: 5,
        rentalType: 'daily',
        price: 18000,
        category: 'sedan',
        image: './assets/Images/aff-sedan-Maruti Dzire-f.avif'
    },
    { 
        brand: 'Hyundai', 
        model: 'Elantra', 
        seats: 4,
        rentalType: 'daily',
        price: 7500, 
        category: 'affordable', 
        image: './assets/Images/aff-sedan-Hyundai Verna-f.avif' 
    },
    { 
        brand: 'BMW', 
        model: 'X7', 
        seats: 4,
        rentalType: 'daily',
        price: 25000, 
        category: 'suv',
        image: './assets/Images/BMW 5-front.avif' 
    }
];


function displayCars(category) {
    const container = document.getElementById('carsContainer');
    container.innerHTML = '';
    const filteredCars = category === 'all' ? cars : cars.filter(car => car.category === category);
    filteredCars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'col-md-4 mb-4';
        carCard.innerHTML = `
            <div class="card car-card position-relative shadow-lg rounded-4 overflow-hidden">
                <img src="${car.image}" class="card-img-top car-image" alt="${car.brand} ${car.model}">
                <div class="card-body text-center">
                    <div class="d-flex align-items-center justify-content-center mb-2">

                        <h5 class="card-title mb-0">${car.model}</h5>
                    </div>
                    <p class="card-text text-muted">
                        <i class="fas fa-users me-2"></i>${car.seats} Seats
                        <br>
                        <i class="fas fa-car me-2"></i>${car.rentalType.charAt(0).toUpperCase() + car.rentalType.slice(1)} Rental
                    </p>
                    <h4 class="mb-3" style="font-size: 17px;"><span class="fw-bold" style="font-size: 21px;color:#183B4E">₹${car.price}</span>/${car.rentalType === 'daily' ? 'day' : 'hour'}</h4>
                    <button class="btn btn-primary w-100">
                        <i class="fas fa-car-alt me-2"></i>Rent Now
                    </button>
                </div>
            </div>
        `;

        container.appendChild(carCard);
    });
}

document.querySelectorAll('.radio-inputs .radio input').forEach(tab => {
    tab.addEventListener('change', function () {
        
        displayCars(this.getAttribute('data-category'));
    });
});

displayCars('all');

function applyFilters() {
    const brandFilter = document.getElementById('brandFilter').value;
    const seatsFilter = document.getElementById('seatsFilter').value;
    const rentalTypeFilter = document.getElementById('rentalTypeFilter').value;
    const priceRangeFilter = document.getElementById('priceRangeFilter').value;
    const priceDisplay = document.getElementById('priceDisplay');

    priceDisplay.textContent = `Max Price: $${priceRangeFilter}`;

    const filteredCars = cars.filter(car => 
        (!brandFilter || car.brand === brandFilter) &&
        (!seatsFilter || car.seats == seatsFilter) &&
        (!rentalTypeFilter || car.rentalType === rentalTypeFilter) &&
        car.price <= priceRangeFilter
    );

    // displayCars(filteredCars);
}

document.getElementById('applyFilters').addEventListener('click', applyFilters);
document.getElementById('priceRangeFilter').addEventListener('input', (e) => {
    document.getElementById('priceDisplay').textContent = `Max Price: $${e.target.value}`;
});

// Initial display of all cars
// displayCars(cars);