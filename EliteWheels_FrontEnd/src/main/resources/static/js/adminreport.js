/* Global Constants */
const backendUrl = 'http://localhost:8081';
const authHeader = 'Basic YWRtaW46YWRtaW4xMjM='; // admin:admin123 encoded in Base64

/* Helper Functions */
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

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function resetFilters() {
    document.getElementById('reportForm').reset();
    document.getElementById('reportContent').innerHTML = '<p class="text-muted">Please generate a report to view the results.</p>';
    document.getElementById('exportButton').disabled = true;
}

function updateFilters() {
   
}

/* Generate Report */
document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reportContent = document.getElementById('reportContent');
    const exportButton = document.getElementById('exportButton');

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert('Start Date must be before End Date.');
        return;
    }

    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Fetching report data for ${reportType}`);
        const params = new URLSearchParams({
            ...(startDate && { startDate }),
            ...(endDate && { endDate })
        });
        const response = await fetchWithAuth(`${backendUrl}/api/reports/${reportType}?${params}`);
        if (!response.ok) throw new Error(`Failed to fetch report: ${response.status} ${response.statusText}`);

        const data = await response.json();
        exportButton.disabled = !data || data.length === 0;

        if (!data || data.length === 0) {
            reportContent.innerHTML = '<p class="text-muted">No data found for the selected criteria.</p>';
            return;
        }

        switch (reportType) {
            case 'bookings':
                reportContent.innerHTML = `
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Car</th>
                                <th>Pickup Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(item => `
                                <tr>
                                    <td>${item.bookingId}</td>
                                    <td>${item.user.firstName} ${item.user.lastName || ''}</td>
                                    <td>${item.car.model}</td>
                                    <td>${formatDate(item.startDatetime)}</td>
                                    <td>${item.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                break;
            case 'customers':
                reportContent.innerHTML = `
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Registered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(item => `
                                <tr>
                                    <td>${item.userId}</td>
                                    <td>${item.firstName} ${item.lastName || ''}</td>
                                    <td>${item.email}</td>
                                    <td>${item.phone}</td>
                                    <td>${formatDate(item.registeredAt)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                break;
            case 'payments':
                reportContent.innerHTML = `
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Amount (₹)</th>
                                <th>Payment Status</th>
                                <th>Payment Method</th>
                                <th>Booking Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(item => `
                                <tr>
                                    <td>${item.bookingId}</td>
                                    <td>${item.user.firstName} ${item.user.lastName || ''}</td>
                                    <td>${item.totalPrice}</td>
                                    <td>${item.paymentStatus}</td>
                                    <td>${item.paymentMethod || 'N/A'}</td>
                                    <td>${formatDate(item.createdAt)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                break;
        }
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error fetching report: ${error.message}`);
        alert('Failed to generate report. Please ensure the backend is running and try again.');
    }
});

/* Export Report as PDF */
async function exportReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    try {
        console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Exporting report as PDF for ${reportType}`);
        const params = new URLSearchParams({
            ...(startDate && { startDate }),
            ...(endDate && { endDate })
        });
        const response = await fetchWithAuth(`${backendUrl}/api/reports/${reportType}/export?${params}`, {
            method: 'GET',
            headers: { 'Accept': 'application/pdf' }
        });
        if (!response.ok) throw new Error(`Failed to export report: ${response.status} ${response.statusText}`);

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Error exporting report: ${error.message}`);
        alert('Failed to export report as PDF. Please try again.');
    }
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