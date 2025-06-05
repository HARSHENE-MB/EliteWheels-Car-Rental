/* Global Constants */
const backendUrl = 'http://localhost:8081';
const pageSize = 5;
const authHeader = 'Basic YWRtaW46YWRtaW4xMjM='; 
let currentPage = 0;
let totalPages = 0;


async function fetchWithAuth(url, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', authHeader);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); 
    try {
        const response = await fetch(url, { ...options, headers, signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error(`Request to ${url} timed out after 5 seconds`);
            throw new Error('Request timed out. Please check if the backend server is running at http://localhost:8081.');
        }
        throw error;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* Booking Fetching and Rendering */
async function fetchBookings(page = 0) {
    try {
        const customerName = document.getElementById('customerName').value.trim();
        const bookingDate = document.getElementById('bookingDate').value;
        const carModel = document.getElementById('carModel').value.trim();
        const status = document.getElementById('status').value;
        const sortBy = document.getElementById('sortBy').value;
        const sortDir = document.getElementById('sortDir').value;

        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Fetching bookings for page ${page}`);
        const params = new URLSearchParams({
            page,
            size: pageSize,
            sortBy,
            sortDir,
            ...(customerName && { customerName }),
            ...(bookingDate && { bookingDate }),
            ...(carModel && { carModel }),
            ...(status && { status })
        });
        const response = await fetchWithAuth(`${backendUrl}/api/bookings?${params}`);
        if (!response.ok) throw new Error(`Failed to fetch bookings: ${response.status} ${response.statusText}`);

        const data = await response.json();
		console.log(data);
        const bookings = data;
        totalPages = data.totalPages || 0;
        currentPage = page;

        const tbody = document.getElementById('bookingsTableBody');
        const noBookingsMessage = document.getElementById('noBookingsMessage');
        if (!tbody || !noBookingsMessage) {
            console.error('Bookings table body or no bookings message not found');
            return;
        }

        tbody.innerHTML = '';
        if (bookings.length === 0) {
            noBookingsMessage.style.display = 'block';
            tbody.innerHTML = '<tr><td colspan="13" class="text-center">No bookings found.</td></tr>';
        } else {
            noBookingsMessage.style.display = 'none';
            bookings.forEach(booking => {
                const row = document.createElement('tr');
                const customerName = `${booking.user.firstName} ${booking.user.lastName || ''}`.trim();
                const contactInfo = `${booking.user.phone}<br>${booking.user.email}`;
                const pickupDate = new Date(booking.startDatetime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                const dropoffDate = new Date(booking.endDatetime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                const location = `${booking.pickupLocation}<br>${booking.dropLocation}`;
                const bookingDate = new Date(booking.createdAt).toLocaleDateString('en-IN');
                row.innerHTML = `
                    <td>${booking.bookingId}</td>
                    <td>${customerName}</td>
                    <td>${contactInfo}</td>
                    <td>${booking.car.model}</td>
                    <td>${booking.car.registrationNumber || 'N/A'}</td>
                    <td>${pickupDate}</td>
                    <td>${dropoffDate}</td>
                    <td>${location}</td>
                    <td><span class="badge bg-${getStatusBadge(booking.status)}">${booking.status}</span></td>
                    <td><span class="badge bg-${getPaymentBadge(booking.paymentStatus)}">${booking.paymentStatus}</span></td>
                    <td>₹${booking.totalPrice}</td>
                    <td>${bookingDate}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-info btn-sm me-1" onclick="viewBookingDetails(${booking.bookingId})" title="View">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-primary btn-sm me-1" onclick="editBooking(${booking.bookingId})" title="Edit">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-danger btn-sm me-1" onclick="cancelBooking(${booking.bookingId})" title="Cancel">
                                <i class="bi bi-x-circle"></i>
                            </button>
                            <button class="btn btn-success btn-sm me-1" onclick="markCompleted(${booking.bookingId})" title="Complete">
                                <i class="bi bi-check-circle"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        updatePagination();
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error fetching bookings: ${error.message}`);
        alert('Failed to load bookings. Please ensure the backend is running and try again.');
    }
}

/* Status Badge Colors */
function getStatusBadge(status) {
    switch (status) {
        case 'Booked': return 'primary';
        case 'In Progress': return 'warning';
        case 'Completed': return 'success';
        case 'Cancelled': return 'danger';
        default: return 'secondary';
    }
}

function getPaymentBadge(paymentStatus) {
    switch (paymentStatus) {
        case 'Paid': return 'success';
        case 'Unpaid': return 'danger';
        case 'Refund Initiated': return 'warning';
        default: return 'secondary';
    }
}

/* Pagination */
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) {
        console.error('Pagination element not found');
        return;
    }

    pagination.innerHTML = '';
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 0 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="fetchBookings(${currentPage - 1})">Previous</a>`;
    pagination.appendChild(prevLi);

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="fetchBookings(${i})">${i + 1}</a>`;
        pagination.appendChild(li);
    }

    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="fetchBookings(${currentPage + 1})">Next</a>`;
    pagination.appendChild(nextLi);
}

/* Booking Details Modal */
async function viewBookingDetails(bookingId) {
    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Fetching booking details for ${bookingId}`);
        const response = await fetchWithAuth(`${backendUrl}/api/bookings/${bookingId}`);
        if (!response.ok) throw new Error(`Failed to fetch booking: ${response.status} ${response.statusText}`);

        const booking = await response.json();
		console.log(booking);
        const modalBody = document.getElementById('bookingDetailBody');
        if (!modalBody) {
            console.error('Booking detail modal body not found');
            return;
        }

        const customerName = `${booking.user.firstName} ${booking.user.lastName || ''}`.trim();
        modalBody.innerHTML = `
            <div class="row g-4">
                <div class="col-md-6">
                    <h4>${customerName}</h4>
                    <hr>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Email:</strong> ${booking.user.email}</p>
                    <p><strong>Phone:</strong> ${booking.user.phone}</p>
                    <p><strong>Car:</strong> ${booking.car.model}</p>
                    <p><strong>Registration:</strong> ${booking.car.registrationNumber || 'N/A'}</p>
                    <p><strong>Driver:</strong> ${booking.driver ? booking.driver.name : 'N/A'}</p>
                </div>
                <div class="col-md-6">
                    <h4>Booking Details</h4>
                    <hr>
                    <p><strong>Pickup:</strong> ${new Date(booking.startDatetime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    <p><strong>Drop-off:</strong> ${new Date(booking.endDatetime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    <p><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>
                    <p><strong>Drop-off Location:</strong> ${booking.dropLocation}</p>
                    <p><strong>Status:</strong> <span class="badge bg-${getStatusBadge(booking.status)}">${booking.status}</span></p>
                    <p><strong>Payment:</strong> <span class="badge bg-${getPaymentBadge(booking.paymentStatus)}">${booking.paymentStatus}</span></p>
                    <p><strong>Amount:</strong> ₹${booking.totalPrice}</p>
                    <p><strong>Booked On:</strong> ${new Date(booking.createdAt).toLocaleDateString('en-IN')}</p>
                    <p><strong>Payment Method:</strong> ${booking.paymentMethod || 'N/A'}</p>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('bookingDetailModal'), { backdrop: 'static' });
        modal.show();
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error loading booking details: ${error.message}`);
        alert('Failed to load booking details. Please try again.');
    }
}

/* Edit Booking Modal */
async function editBooking(id) {
    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Fetching booking ${id} for editing`);
        const response = await fetchWithAuth(`${backendUrl}/api/bookings/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch booking: ${response.status} ${response.statusText}`);

        const booking = await response.json();
        document.getElementById('bookingId').value = booking.bookingId;
        document.getElementById('startDatetime').value = booking.startDatetime.slice(0, 16);
        document.getElementById('endDatetime').value = booking.endDatetime.slice(0, 16);
        document.getElementById('pickupLocation').value = booking.pickupLocation;
        document.getElementById('dropLocation').value = booking.dropLocation;
        document.getElementById('totalPrice').value = booking.totalPrice;
        document.getElementById('paymentMethod').value = booking.paymentMethod || '';
        document.getElementById('bookingStatus').value = booking.status;
        document.getElementById('paymentStatus').value = booking.paymentStatus;

        const modal = new bootstrap.Modal(document.getElementById('bookingModal'), { backdrop: 'static' });
        modal.show();
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error fetching booking for editing: ${error.message}`);
        alert('Failed to load booking details for editing. Please try again.');
    }
}

/* Form Submission for Edit Booking */
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookingId = document.getElementById('bookingId').value;

    // Fetch the original booking to get user and car IDs
    const fetchResponse = await fetchWithAuth(`${backendUrl}/api/bookings/${bookingId}`);
    if (!fetchResponse.ok) {
        alert('Failed to fetch booking details.');
        return;
    }
    const originalBooking = await fetchResponse.json();

    const bookingData = {
        startDatetime: new Date(document.getElementById('startDatetime').value).toISOString(),
        endDatetime: new Date(document.getElementById('endDatetime').value).toISOString(),
        pickupLocation: document.getElementById('pickupLocation').value,
        dropLocation: document.getElementById('dropLocation').value,
        totalPrice: parseFloat(document.getElementById('totalPrice').value),
        paymentMethod: document.getElementById('paymentMethod').value || null,
        status: document.getElementById('bookingStatus').value,
        paymentStatus: document.getElementById('paymentStatus').value,
        user: { userId: originalBooking.user.userId }, // Use existing userId
        car: { carId: originalBooking.car.carId },     // Use existing carId
        driver: originalBooking.driver ? { driverId: originalBooking.driver.driverId } : null
    };

    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Saving booking ${bookingId}`);
        const response = await fetchWithAuth(`${backendUrl}/api/bookings/${bookingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save booking: ${errorText}`);
        }

        bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
        document.getElementById('bookingForm').reset();
        fetchBookings(currentPage);
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error saving booking: ${error.message}`);
        alert(`Failed to save booking: ${error.message}`);
    }
});

/* Cancel Booking */
async function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Cancelling booking ${id}`);
        const response = await fetchWithAuth(`${backendUrl}/api/bookings/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify('Cancelled')
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to cancel booking: ${errorText}`);
        }

        fetchBookings(currentPage);
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error cancelling booking: ${error.message}`);
        alert(`Failed to cancel booking: ${error.message}`);
    }
}

/* Mark as Completed */
async function markCompleted(id) {
    if (!confirm('Mark this booking as completed?')) return;

    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Marking booking ${id} as completed`);
        const response = await fetchWithAuth(`${backendUrl}/api/bookings/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify('Completed')
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to complete booking: ${errorText}`);
        }

        fetchBookings(currentPage);
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error completing booking: ${error.message}`);
        alert(`Failed to complete booking: ${error.message}`);
    }
}

/* Search Form Submission */
const debouncedFetchBookings = debounce(fetchBookings, 500);
document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    debouncedFetchBookings(0);
});

/* Reset Search */
function resetSearch() {
    document.getElementById('searchForm').reset();
    debouncedFetchBookings(0);
}

/* UI Interactions */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function showNotifications() {
    alert('No new notifications');
}

function logout() {
    window.location.href = '/perform_logout';
}

/* Initialization */
document.addEventListener('DOMContentLoaded', () => {
    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Initializing booking management page`);
    function attemptFetchBookings(attempts = 5, delay = 500) {
        const tbody = document.getElementById('bookingsTableBody');
        const noBookingsMessage = document.getElementById('noBookingsMessage');
        if (!tbody || !noBookingsMessage) {
            if (attempts > 0) {
                console.warn(`Required elements not found, retrying (${attempts} attempts left)...`);
                setTimeout(() => attemptFetchBookings(attempts - 1, delay), delay);
            } else {
                console.error('Bookings table body or no bookings message not found after retries');
            }
            return;
        }
        fetchBookings();
    }
    attemptFetchBookings();
});