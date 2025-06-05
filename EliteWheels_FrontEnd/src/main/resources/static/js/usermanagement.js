/* Global Constants */
const backendUrl = 'http://localhost:8081';
const pageSize = 5;
const authHeader = 'Basic YWRtaW46YWRtaW4xMjM='; // admin:admin123 encoded in Base64
let currentPage = 0;
let totalPages = 0;

/* Helper Functions */
async function fetchWithAuth(url, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', authHeader);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
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

/* User Fetching and Rendering */
async function fetchUsers(page = 0) {
    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Fetching users for page ${page}`);
        const response = await fetchWithAuth(`${backendUrl}/api/users?page=${page}&size=${pageSize}`);
        if (!response.ok) throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);

        const data = await response.json();
        const users = data;
        totalPages = data.totalPages || 0;
        currentPage = page;

        const tbody = document.getElementById('usersTableBody');
        if (!tbody) {
            console.error('Users table body not found');
            return;
        }

        tbody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            const fullName = `${user.firstName} ${user.middleName || ''} ${user.lastName}`.trim();
            row.innerHTML = `
                <td>${user.userId}</td>
                <td>${fullName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td><span class="badge bg-${user.status === 'active' ? 'success' : 'danger'}">${user.status}</span></td>
                <td>${new Date(user.registeredAt).toLocaleDateString()}</td>
                <td><button class="btn btn-info btn-sm" onclick="downloadFile(${user.userId}, 'profile-photo')">Download</button></td>
                <td><button class="btn btn-info btn-sm" onclick="downloadFile(${user.userId}, 'id-proof')">Download</button></td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-info btn-sm me-1" onclick="viewUserDetails(${user.userId})" title="View">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-outline-primary btn-sm me-1" onclick="editUser(${user.userId})" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm me-1" onclick="deleteUser(${user.userId})" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button class="btn btn-success btn-sm" onclick="toggleUserStatus(${user.userId})" title="${user.status === 'active' ? 'Deactivate' : 'Activate'}">
                            <i class="bi ${user.status === 'active' ? 'bi-pause-circle' : 'bi-play-circle'} me-1"></i>
                            ${user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        updatePagination();
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error fetching users: ${error.message}`);
        if (error.message.includes('timed out') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
            console.error(`Backend server not reachable at ${backendUrl}/api/users?page=${page}&size=${pageSize}. Ensure the backend is running on http://localhost:8081.`);
            alert('Cannot connect to the backend server. Please ensure the backend is running on http://localhost:8081 and try again.');
        } else {
            alert('Failed to load users. Please try again.');
        }
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
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="fetchUsers(${currentPage - 1})">Previous</a>`;
    pagination.appendChild(prevLi);

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="fetchUsers(${i})">${i + 1}</a>`;
        pagination.appendChild(li);
    }

    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="fetchUsers(${currentPage + 1})">Next</a>`;
    pagination.appendChild(nextLi);
}

/* User Details Modal */
async function viewUserDetails(userId) {
    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Fetching user details for user ${userId}`);
        const response = await fetchWithAuth(`${backendUrl}/api/users/${userId}`);
        if (!response.ok) throw new Error(`Failed to fetch user details: ${response.status} ${response.statusText}`);

        const user = await response.json();
        const modalBody = document.getElementById('userDetailBody');
        if (!modalBody) {
            console.error('User detail modal body not found');
            return;
        }

        let profilePhotoUrl = 'https://via.placeholder.com/150?text=No+Photo';
        try {
            console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Fetching profile photo for user ${userId}`);
            const photoResponse = await fetchWithAuth(`${backendUrl}/api/users/${user.userId}/profile-photo`);
            if (photoResponse.ok) {
                const blob = await photoResponse.blob();
                profilePhotoUrl = URL.createObjectURL(blob);
                console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Profile photo fetched successfully for user ${userId}`);
            } else {
                console.warn(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] No profile photo available for user ${userId}`);
            }
        } catch (photoError) {
            console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error fetching profile photo for user ${userId}: ${photoError.message}`);
        }

        const fullName = `${user.firstName} ${user.middleName || ''} ${user.lastName}`.trim();
        modalBody.innerHTML = `
            <div class="row g-4">
                <div class="col-md-6">
                    <img src="${profilePhotoUrl}" class="img-fluid rounded-3 shadow-sm" alt="${fullName}">
                    <br>
                    <hr>
                    <p class="text-muted fs-6" style="line-height: 1.8;">
                        <strong>${fullName}</strong> is a registered user with the role <strong>${user.role.roleName}</strong>. 
                        Registered on <strong>${new Date(user.registeredAt).toLocaleDateString()}</strong>, with a driving license number 
                        <strong>${user.driverLicenseNumber}</strong>. Contactable via email at <strong>${user.email}</strong> or phone at 
                        <strong>${user.phone}</strong>.
                    </p>
                </div>
                <div class="col-md-6 ps-md-5">
                    <h4 class="mb-3">${fullName}</h4>
                    <hr><br>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <p><strong>Status:</strong> <span class="badge bg-${user.status === 'active' ? 'success' : 'danger'}">${user.status}</span></p>
                    <p><strong>Registration Date:</strong> ${new Date(user.registeredAt).toLocaleDateString()}</p>
                    <p><strong>Date of Birth:</strong> ${user.dob}</p>
                    <p><strong>Gender:</strong> ${user.gender}</p>
                    <p><strong>Nationality:</strong> ${user.nationality}</p>
                    <p><strong>Occupation:</strong> ${user.occupation}</p>
                    <p><strong>Address:</strong> ${user.address}, ${user.state}, ${user.pincode}</p>
                    <p><strong>Driving License:</strong> ${user.driverLicenseNumber}</p>
                    <p><strong>ID Proof Type:</strong> ${user.idProofType}</p>
                    <p><strong>Role:</strong> ${user.role.roleName}</p>
                    <p><strong>Terms Accepted:</strong> ${user.termsAndConditions ? 'Yes' : 'No'}</p>
                    <p><strong>Data Consent:</strong> ${user.dataHandlingConsent ? 'Yes' : 'No'}</p>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('userDetailModal'), { backdrop: 'static' });
        modal.show();

        document.getElementById('userDetailModal').addEventListener('shown.bs.modal', () => {
            document.getElementById('userDetailModal').removeAttribute('aria-hidden');
        }, { once: true });

        document.getElementById('userDetailModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('userDetailModal').setAttribute('aria-hidden', 'true');
            if (profilePhotoUrl !== 'https://via.placeholder.com/150?text=No+Photo') {
                URL.revokeObjectURL(profilePhotoUrl);
            }
        }, { once: true });
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error loading user details for user ${userId}: ${error.message}`);
        alert('Failed to load user details. Please ensure the backend is running and try again.');
    }
}

/* Edit User Modal */
async function editUser(id) {
    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Fetching user ${id} for editing`);
        const response = await fetchWithAuth(`${backendUrl}/api/users/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);

        const user = await response.json();
        document.getElementById('userId').value = user.userId;
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('middleName').value = user.middleName || '';
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('dob').value = user.dob;
        document.getElementById('gender').value = user.gender;
        document.getElementById('nationality').value = user.nationality;
        document.getElementById('occupation').value = user.occupation;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;
        document.getElementById('address').value = user.address;
        document.getElementById('state').value = user.state;
        document.getElementById('pincode').value = user.pincode;
        document.getElementById('idProofType').value = user.idProofType;
        document.getElementById('drivingLicenseNumber').value = user.driverLicenseNumber;
        document.getElementById('termsAndConditions').checked = user.termsAndConditions;
        document.getElementById('dataHandlingConsent').checked = user.dataHandlingConsent;
        document.getElementById('roleId').value = user.role.roleId;

        const modal = new bootstrap.Modal(document.getElementById('userModal'), { backdrop: 'static' });
        modal.show();
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error fetching user ${id} for editing: ${error.message}`);
        alert('Failed to load user details for editing. Please ensure the backend is running and try again.');
    }
}

/* Delete User */
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Deleting user ${id}`);
        const response = await fetchWithAuth(`${backendUrl}/api/users/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);

        fetchUsers(currentPage);
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error deleting user ${id}: ${error.message}`);
        alert('Failed to delete user. Please ensure the backend is running and try again.');
    }
}

/* Toggle User Status */
async function toggleUserStatus(id) {
    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Toggling status for user ${id}`);
        const response = await fetchWithAuth(`${backendUrl}/api/users/${id}/status`, { method: 'PUT' });
        if (!response.ok) throw new Error(`Failed to toggle user status: ${response.status} ${response.statusText}`);

        fetchUsers(currentPage);
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error toggling user status for user ${id}: ${error.message}`);
        alert('Failed to toggle user status. Please ensure the backend is running and try again.');
    }
}

/* Download Files (Profile Photo/ID Proof) */
async function downloadFile(userId, type) {
    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Downloading ${type} for user ${userId}`);
        const response = await fetchWithAuth(`${backendUrl}/api/users/${userId}/${type}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`${type === 'profile-photo' ? 'Profile photo' : 'ID proof'} not found for user.`);
            }
            throw new Error(`Failed to download ${type}: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-${userId}.${type === 'profile-photo' ? 'jpg' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] ${type} downloaded successfully for user ${userId}`);
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error downloading ${type} for user ${userId}: ${error.message}`);
        alert(`Failed to download ${type}: ${error.message}`);
    }
}

/* Fetch Roles for Edit Modal */
async function fetchRoles() {
    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Fetching roles`);
        const response = await fetchWithAuth(`${backendUrl}/api/roles`);
        if (!response.ok) throw new Error(`Failed to fetch roles: ${response.status} ${response.statusText}`);

        const roles = await response.json();
        const select = document.getElementById('roleId');
        if (!select) {
            console.error('Role select element not found');
            return;
        }

        select.innerHTML = '<option value="">Select Role</option>';
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.roleId;
            option.textContent = role.roleName;
            select.appendChild(option);
        });
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error fetching roles: ${error.message}`);
        alert('Failed to load roles. Please ensure the backend is running and try again.');
    }
}

/* Form Submission for Edit User */
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('firstName', document.getElementById('firstName').value);
    formData.append('middleName', document.getElementById('middleName').value);
    formData.append('lastName', document.getElementById('lastName').value);
    formData.append('dob', document.getElementById('dob').value);
    formData.append('gender', document.getElementById('gender').value);
    formData.append('nationality', document.getElementById('nationality').value);
    formData.append('occupation', document.getElementById('occupation').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('phone', document.getElementById('phone').value);
    formData.append('address', document.getElementById('address').value);
    formData.append('state', document.getElementById('state').value);
    formData.append('pincode', document.getElementById('pincode').value);
    formData.append('idProofType', document.getElementById('idProofType').value);
    formData.append('drivingLicenseNumber', document.getElementById('drivingLicenseNumber').value);
    formData.append('termsAndConditions', document.getElementById('termsAndConditions').checked);
    formData.append('dataHandlingConsent', document.getElementById('dataHandlingConsent').checked);
    formData.append('roleId', document.getElementById('roleId').value);

    const idProof = document.getElementById('idProof').files[0];
    if (idProof) formData.append('idProof', idProof);

    try {
        const userId = document.getElementById('userId').value;
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Saving user ${userId}`);
        const url = `${backendUrl}/api/users/${userId}`;
        const response = await fetchWithAuth(url, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save user: ${errorText}`);
        }

        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        document.getElementById('userForm').reset();
        fetchUsers(currentPage);
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] User ${userId} saved successfully`);
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error saving user: ${error.message}`);
        alert(`Failed to save user: ${error.message}`);
    }
});

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
    const userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.addEventListener('hidden.bs.modal', () => {
            document.querySelector('body').focus();
        });
    }

    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Initializing user management page`);
    fetchUsers();
    fetchRoles();
});