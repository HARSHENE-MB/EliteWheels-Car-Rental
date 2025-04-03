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
        <div class="image">
            <img src="${car.image}" class="card-img-top car-image" alt="${car.brand} ${car.model}">
        </div>
        <div class="card-body text-center">
            <h5 class="card-title mb-1">${car.model}</h5>
            <p class="car-seats text-muted">
                <i class="fas fa-users me-2"></i>${car.seats} Seats
            </p>
            <h4 class="price mb-2">
                <span class="fw-bold" style="font-size: 28px;color:#183B4E">₹${car.price}</span>/${car.rentalType === 'daily' ? 'day' : 'hour'}
            </h4>
            <p class="features text-success"><i class="fas fa-check-circle"></i> Free Delivery</p>
            <p class="features text-success"><i class="fas fa-check-circle"></i> Insurance Included</p>
        </div>
        <div class="rent-now">Rent Now</div>
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

const sparkle = document.querySelector(".headlight-sparkle");

setInterval(() => {
    const randomScale = 1.8 + Math.random() * 0.4;
    const randomBlur = 10 + Math.random() * 6;
    sparkle.style.transform = `scale(${randomScale})`;
    sparkle.style.filter = `blur(${randomBlur}px)`;
}, 400);


// Initial display of all cars
// displayCars(cars);