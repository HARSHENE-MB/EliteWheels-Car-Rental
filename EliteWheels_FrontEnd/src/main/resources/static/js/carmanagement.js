const backendUrl = 'http://localhost:8081';
const pageSize = 5;
let currentPage = 0;
let totalPages = 0;

async function fetchCars(page = 0) {
    try {
        const response = await fetch(`${backendUrl}/api/cars?page=${page}&size=${pageSize}`, {
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to fetch cars');
        const data = await response.json();
        const cars = data;
        totalPages = data.totalPages || 0;
        currentPage = page;

        const tbody = document.getElementById('carsTableBody');
        if (!tbody) {
            console.error('Cars table body not found');
            return;
        }
        tbody.innerHTML = '';
        cars.forEach(car => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${car.carId}</td>
                <td>${car.brand.brandName}</td>
                <td>${car.model}</td>
                <td>${car.vehicleNo}</td>
                <td>${car.year}</td>
                <td>₹${car.rentalRate}/hour</td>
                <td>${car.status}</td>
                <td>
                    <button class="btn btn-info me-1" onclick="viewCarDetails(${car.carId})">View</button>
                    <button class="btn btn-outline-primary me-1" onclick="editCar(${car.carId})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteCar(${car.carId})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        updatePagination();
    } catch (error) {
        console.error('Error fetching cars:', error);
        alert('Failed to load cars. Please ensure the backend is running.');
    }
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) {
        console.error('Pagination element not found');
        return;
    }
    pagination.innerHTML = '';

    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 0 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="fetchCars(${currentPage - 1})">Previous</a>`;
    pagination.appendChild(prevLi);

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="fetchCars(${i})">${i + 1}</a>`;
        pagination.appendChild(li);
    }

    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="fetchCars(${currentPage + 1})">Next</a>`;
    pagination.appendChild(nextLi);
}

async function viewCarDetails(carId) {
    try {
        const response = await fetch(`${backendUrl}/api/cars/${carId}`, {
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to fetch car details');
        const car = await response.json();

        const modalBody = document.getElementById('carDetailBody');
        if (!modalBody) {
            console.error('Car detail modal body not found');
            return;
        }

        modalBody.innerHTML = `
            <div class="row g-4">
                <div class="col-md-6">
                    <img src="/assets/${car.imageUrl || 'default-car-image.jpg'}" class="img-fluid rounded-3 shadow-sm" alt="${car.model}">
                    <br>
                    <hr>
                    <p class="text-muted fs-6" style="line-height: 1.8;">
                        Introducing the <strong>${car.brand.brandName} ${car.model}</strong>, a premium ${car.type.typeName} launched in <strong>${car.year}</strong>, 
                        designed for both comfort and performance. With <strong>${car.seatCount}</strong> seats and a mileage of 
                        <strong>${car.mileage ? car.mileage.toLocaleString() : 'N/A'} km</strong>, this vehicle offers a smooth ride enhanced by features like 
                        <strong>${car.features || 'N/A'}</strong>. Ideal for city commutes and long trips alike.
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
                    <p><strong>Mileage:</strong> ${car.mileage ? car.mileage + ' km' : 'N/A'}</p>
                    <p><strong>Features:</strong> ${car.features || 'N/A'}</p>
                    <p><strong>Price:</strong> ₹${car.rentalRate}/hour</p>
                    <span class="badge bg-success">${car.status}</span>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('carDetailModal'), { backdrop: 'static' });
        modal.show();

        document.getElementById('carDetailModal').addEventListener('shown.bs.modal', () => {
            document.getElementById('carDetailModal').removeAttribute('aria-hidden');
        }, { once: true });

        document.getElementById('carDetailModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('carDetailModal').setAttribute('aria-hidden', 'true');
        }, { once: true });
    } catch (error) {
        console.error('Error loading car details:', error);
        alert('Failed to load car details');
    }
}

async function fetchBrands() {
    try {
        const response = await fetch(`${backendUrl}/api/brands`, {
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to fetch brands');
        const brands = await response.json();
        const tbody = document.getElementById('brandsTableBody');
        const select = document.getElementById('brandId');
        if (!tbody || !select) {
            console.error('Brands table body or select element not found');
            return;
        }
        tbody.innerHTML = '';
        select.innerHTML = '<option value="">Select Brand</option>';
        brands.forEach(brand => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${brand.brandId}</td>
                <td>${brand.brandName}</td>
                <td>
                    <button class="btn btn-outline-primary" onclick="editBrand(${brand.brandId})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteBrand(${brand.brandId})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
            const option = document.createElement('option');
            option.value = brand.brandId;
            option.textContent = brand.brandName;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
        alert('Failed to load brands');
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(`${backendUrl}/api/categories`, {
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();
        const tbody = document.getElementById('categoriesTableBody');
        const select = document.getElementById('categoryId');
        if (!tbody || !select) {
            console.error('Categories table body or select element not found');
            return;
        }
        tbody.innerHTML = '';
        select.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.categoryId}</td>
                <td>${category.categoryName}</td>
                <td>
                    <button class="btn btn-outline-primary" onclick="editCategory(${category.categoryId})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteCategory(${category.categoryId})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
            const option = document.createElement('option');
            option.value = category.categoryId;
            option.textContent = category.categoryName;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories');
    }
}

async function fetchTypes() {
    try {
        const response = await fetch(`${backendUrl}/api/types`, {
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to fetch types');
        const types = await response.json();
        const tbody = document.getElementById('typesTableBody');
        const select = document.getElementById('typeId');
        if (!tbody || !select) {
            console.error('Types table body or select element not found');
            return;
        }
        tbody.innerHTML = '';
        select.innerHTML = '<option value="">Select Type</option>';
        types.forEach(type => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${type.typeId}</td>
                <td>${type.typeName}</td>
                <td>
                    <button class="btn btn-outline-primary" onclick="editType(${type.typeId})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteType(${type.typeId})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
            const option = document.createElement('option');
            option.value = type.typeId;
            option.textContent = type.typeName;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching types:', error);
        alert('Failed to load types');
    }
}

function resetCarForm() {
    document.getElementById('carForm').reset();
    document.getElementById('carId').value = '';
    document.getElementById('carModalLabel').textContent = 'Add Car';
}

async function editCar(id) {
    try {
        const response = await fetch(`${backendUrl}/api/cars/${id}`, {
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to fetch car');
        const car = await response.json();
        console.log(`Editing car ID ${id}: imageUrl = ${car.imageUrl}`);
        document.getElementById('carId').value = car.carId;
        document.getElementById('brandId').value = car.brand.brandId;
        document.getElementById('model').value = car.model;
        document.getElementById('vehicleNo').value = car.vehicleNo;
        document.getElementById('year').value = car.year;
        document.getElementById('typeId').value = car.type.typeId;
        document.getElementById('categoryId').value = car.category.categoryId;
        document.getElementById('rentalRate').value = car.rentalRate;
        document.getElementById('status').value = car.status;
        document.getElementById('seatCount').value = car.seatCount;
        document.getElementById('mileage').value = car.mileage;
        document.getElementById('features').value = car.features;
        document.getElementById('imageUrl').value = car.imageUrl;
        document.getElementById('carModalLabel').textContent = 'Edit Car';
        const modal = new bootstrap.Modal(document.getElementById('carModal'), { backdrop: 'static' });
        modal.show();
    } catch (error) {
        console.error('Error fetching car:', error);
        alert('Failed to load car details');
    }
}

async function deleteCar(id) {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
        const response = await fetch(`${backendUrl}/api/cars/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to delete car');
        fetchCars(currentPage);
    } catch (error) {
        console.error('Error deleting car:', error);
        alert('Failed to delete car');
    }
}

async function editBrand(id) {
    try {
        const response = await fetch(`${backendUrl}/api/brands/${id}`, {
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to fetch brand');
        const brand = await response.json();
        document.getElementById('brandId').value = brand.brandId;
        document.getElementById('brandName').value = brand.brandName;
        document.getElementById('brandModalLabel').textContent = 'Edit Brand';
        const modal = new bootstrap.Modal(document.getElementById('brandModal'), { backdrop: 'static' });
        modal.show();
    } catch (error) {
        console.error('Error fetching brand:', error);
        alert('Failed to load brand details');
    }
}

async function deleteBrand(id) {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    try {
        const response = await fetch(`${backendUrl}/api/brands/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to delete brand');
        fetchBrands();
    } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Failed to delete brand');
    }
}

async function editCategory(id) {
    try {
        const response = await fetch(`${backendUrl}/api/categories/${id}`, {
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to fetch category');
        const category = await response.json();
        document.getElementById('categoryId').value = category.categoryId;
        document.getElementById('categoryName').value = category.categoryName;
        document.getElementById('categoryModalLabel').textContent = 'Edit Category';
        const modal = new bootstrap.Modal(document.getElementById('categoryModal'), { backdrop: 'static' });
        modal.show();
    } catch (error) {
        console.error('Error fetching category:', error);
        alert('Failed to load category details');
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
        const response = await fetch(`${backendUrl}/api/categories/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to delete category');
        fetchCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
    }
}

async function editType(id) {
    try {
        const response = await fetch(`${backendUrl}/api/types/${id}`, {
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to fetch type');
        const type = await response.json();
        document.getElementById('typeId').value = type.typeId;
        document.getElementById('typeName').value = type.typeName;
        document.getElementById('typeModalLabel').textContent = 'Edit Type';
        const modal = new bootstrap.Modal(document.getElementById('typeModal'), { backdrop: 'static' });
        modal.show();
    } catch (error) {
        console.error('Error fetching type:', error);
        alert('Failed to load type details');
    }
}

async function deleteType(id) {
    if (!confirm('Are you sure you want to delete this type?')) return;
    try {
        const response = await fetch(`${backendUrl}/api/types/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Basic ' + btoa('admin:admin123') }
        });
        if (!response.ok) throw new Error('Failed to delete type');
        fetchTypes();
    } catch (error) {
        console.error('Error deleting type:', error);
        alert('Failed to delete type');
    }
}

document.getElementById('carForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const car = {
        carId: document.getElementById('carId').value,
        brand: { brandId: document.getElementById('brandId').value },
        model: document.getElementById('model').value,
        vehicleNo: document.getElementById('vehicleNo').value,
        year: document.getElementById('year').value,
        type: { typeId: document.getElementById('typeId').value },
        category: { categoryId: document.getElementById('categoryId').value },
        rentalRate: document.getElementById('rentalRate').value,
        status: document.getElementById('status').value,
        seatCount: document.getElementById('seatCount').value,
        mileage: document.getElementById('mileage').value,
        features: document.getElementById('features').value,
        imageUrl: document.getElementById('imageUrl').value
    };
    console.log(`Saving car ID ${car.carId}: imageUrl = ${car.imageUrl}`);
    try {
        const url = car.carId ? `${backendUrl}/api/cars/${car.carId}` : `${backendUrl}/api/cars`;
        const method = car.carId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin123')
            },
            body: JSON.stringify(car)
        });
        if (!response.ok) {
            const errorText = await response.text();
            if (errorText.includes('vehicleNo')) {
                throw new Error('Vehicle number already exists');
            }
            throw new Error(`Failed to save car: ${errorText}`);
        }
        const savedCar = await response.json();
        console.log(`Saved car ID ${savedCar.carId}: imageUrl = ${savedCar.imageUrl}`);
        bootstrap.Modal.getInstance(document.getElementById('carModal')).hide();
        document.getElementById('carForm').reset();
        fetchCars(currentPage);
    } catch (error) {
        console.error('Error saving car:', error);
        alert(`Failed to save car: ${error.message}`);
    }
});

document.getElementById('brandForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const brand = {
        brandId: document.getElementById('brandId').value,
        brandName: document.getElementById('brandName').value
    };
    try {
        const url = brand.brandId ? `${backendUrl}/api/brands/${brand.brandId}` : `${backendUrl}/api/brands`;
        const method = brand.brandId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin123')
            },
            body: JSON.stringify(brand)
        });
        if (!response.ok) throw new Error('Failed to save brand');
        bootstrap.Modal.getInstance(document.getElementById('brandModal')).hide();
        document.getElementById('brandForm').reset();
        document.getElementById('brandModalLabel').textContent = 'Add Brand';
        fetchBrands();
    } catch (error) {
        console.error('Error saving brand:', error);
        alert('Failed to save brand');
    }
});

document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const category = {
        categoryId: document.getElementById('categoryId').value,
        categoryName: document.getElementById('categoryName').value
    };
    try {
        const url = category.categoryId ? `${backendUrl}/api/categories/${category.categoryId}` : `${backendUrl}/api/categories`;
        const method = category.categoryId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin123')
            },
            body: JSON.stringify(category)
        });
        if (!response.ok) throw new Error('Failed to save category');
        bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryModalLabel').textContent = 'Add Category';
        fetchCategories();
    } catch (error) {
        console.error('Error saving category:', error);
        alert('Failed to save category');
    }
});

document.getElementById('typeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = {
        typeId: document.getElementById('typeId').value,
        typeName: document.getElementById('typeName').value
    };
    try {
        const url = type.typeId ? `${backendUrl}/api/types/${type.typeId}` : `${backendUrl}/api/types`;
        const method = type.typeId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin123')
            },
            body: JSON.stringify(type)
        });
        if (!response.ok) throw new Error('Failed to save type');
        bootstrap.Modal.getInstance(document.getElementById('typeModal')).hide();
        document.getElementById('typeForm').reset();
        document.getElementById('typeModalLabel').textContent = 'Add Type';
        fetchTypes();
    } catch (error) {
        console.error('Error saving type:', error);
        alert('Failed to save type');
    }
});

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function showNotifications() {
    alert('No new notifications');
}

function logout() {
    window.location.href = '/perform_logout';
}

document.addEventListener('DOMContentLoaded', () => {
    const carModal = document.getElementById('carModal');
    if (carModal) {
        carModal.addEventListener('hidden.bs.modal', () => {
            document.querySelector('body').focus();
        });
    }
    fetchCars();
    fetchBrands();
    fetchCategories();
    fetchTypes();
});