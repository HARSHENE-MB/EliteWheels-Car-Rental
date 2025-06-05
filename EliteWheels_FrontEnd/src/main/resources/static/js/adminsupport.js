
console.log('window.backendUrl:', window.backendUrl);


const BASE_URL = window.backendUrl || 'http://localhost:8081';

async function viewTicket(ticketId) {
    try {
        const response = await fetch(`${BASE_URL}/api/admin/support/tickets/${ticketId}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch ticket: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const ticket = await response.json();
        
        document.getElementById('modalTicketId').textContent = ticket.ticketId;
        document.getElementById('responseTicketId').value = ticket.ticketId;
        document.getElementById('modalName').textContent = ticket.name;
        document.getElementById('modalEmail').textContent = ticket.email;
        document.getElementById('modalPhone').textContent = ticket.phone;
        document.getElementById('modalIssueType').textContent = ticket.issueType;
        document.getElementById('modalStatus').value = ticket.status;
        document.getElementById('modalDate').textContent = ticket.date;
        document.getElementById('modalDescription').textContent = ticket.description;

        const responsesContainer = document.getElementById('previousResponses');
        responsesContainer.innerHTML = '';
        if (ticket.responses) {
            const responses = ticket.responses.split('\n').filter(r => r.trim());
            responses.forEach(response => {
                const responseItem = document.createElement('div');
                responseItem.className = 'response-item';
                responseItem.innerHTML = `
                    <p class="response-text">${response.replace(/\[.*?\]/, '').trim()}</p>
                    <div class="response-meta">
                        <span class="response-date">${response.match(/\[.*?\]/)?.[0]?.slice(1, -1) || ''}</span>
                        <span class="email-badge"><i class="bi bi-envelope-fill"></i> Sent via email</span>
                    </div>
                `;
                responsesContainer.appendChild(responseItem);
            });
        } else {
            responsesContainer.innerHTML = '<p class="text-muted">No previous responses</p>';
        }

        const modal = new bootstrap.Modal(document.getElementById('ticketModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching ticket:', error);
        alert(`Failed to load ticket details: ${error.message}. Please ensure the backend server is running on ${BASE_URL}.`);
    }
}

async function fetchTicketsWithRetry(ticketId, expectedStatus, maxRetries = 5, delayMs = 1000) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const cacheBuster = new Date().getTime();
            const response = await fetch(`${BASE_URL}/api/admin/support/tickets?_=${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch tickets: ${response.status} ${response.statusText} - ${errorText}`);
            }
            const tickets = await response.json();
            console.log(`Retry ${retries + 1}/${maxRetries} - Fetched tickets:`, tickets);
            const ticket = tickets.find(t => t.ticketId === ticketId);
            if (ticket) {
                console.log(`Ticket ${ticketId} found with status: ${ticket.status}`);
                if (ticket.status.toLowerCase() === expectedStatus.toLowerCase()) {
                    return tickets;
                }
            } else {
                console.log(`Ticket ${ticketId} not found in fetched tickets.`);
            }
            retries++;
            if (retries === maxRetries) {
                console.warn(`Ticket ${ticketId} did not update to status ${expectedStatus} after ${maxRetries} retries. Returning latest tickets.`);
                return tickets;
            }
            await new Promise(resolve => setTimeout(resolve, delayMs));
        } catch (error) {
            retries++;
            console.error(`Retry ${retries}/${maxRetries} - Error fetching tickets: ${error.message}`);
            if (retries === maxRetries) {
                console.error(`Failed to fetch tickets after ${maxRetries} retries: ${error.message}. Returning empty array.`);
                return [];
            }
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    return [];
}

async function updateStatus() {
    const ticketId = document.getElementById('modalTicketId').textContent;
    const status = document.getElementById('modalStatus').value;

    try {
        const response = await fetch(`${BASE_URL}/api/admin/support/tickets/${ticketId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(status)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update status: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const responseData = await response.json();
        console.log(`PUT response for ticket ${ticketId}:`, responseData);

        const allTicketsHeading = document.querySelector('.card-header h3');
        if (allTicketsHeading) {
            allTicketsHeading.setAttribute('tabindex', '-1');
            allTicketsHeading.focus();
            allTicketsHeading.addEventListener('focus', () => {
                console.log('Focus moved to All Tickets heading');
            }, { once: true });
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        const modalElement = document.getElementById('ticketModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();

        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = 'Ticket status updated successfully!';
        document.querySelector('.main-content .container-fluid').prepend(successDiv);
        setTimeout(() => successDiv.remove(), 3000);

        setTimeout(() => refreshTickets(), 2000);
        setTimeout(() => refreshTickets(), 4000);
    } catch (error) {
        console.error('Error updating status:', error);
        alert(`Failed to update ticket status: ${error.message}`);
    }
}

async function closeTicket() {
    const ticketId = document.getElementById('modalTicketId').textContent;

    try {
        const response = await fetch(`${BASE_URL}/api/admin/support/tickets/${ticketId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify('Closed')
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to close ticket: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const responseData = await response.json();
        console.log(`PUT response for ticket ${ticketId}:`, responseData);

        const allTicketsHeading = document.querySelector('.card-header h3');
        if (allTicketsHeading) {
            allTicketsHeading.setAttribute('tabindex', '-1');
            allTicketsHeading.focus();
            allTicketsHeading.addEventListener('focus', () => {
                console.log('Focus moved to All Tickets heading');
            }, { once: true });
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        const modalElement = document.getElementById('ticketModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();

        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = 'Ticket closed successfully!';
        document.querySelector('.main-content .container-fluid').prepend(successDiv);
        setTimeout(() => successDiv.remove(), 3000);

        setTimeout(() => refreshTickets(), 2000);
        setTimeout(() => refreshTickets(), 4000);
    } catch (error) {
        console.error('Error closing ticket:', error);
        alert(`Failed to close ticket: ${error.message}`);
    }
}

document.getElementById('responseForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const ticketId = document.getElementById('responseTicketId').value;
    const response = formData.get('response');
    const sendAsEmail = formData.get('sendAsEmail') === 'on';

    try {
        const res = await fetch(`${BASE_URL}/api/admin/support/tickets/response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ ticketId, response, sendAsEmail })
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to send response: ${res.status} ${res.statusText} - ${errorText}`);
        }
        const updatedTicket = await res.json();
        const responsesContainer = document.getElementById('previousResponses');
        const newResponseItem = document.createElement('div');
        newResponseItem.className = 'response-item';
        newResponseItem.innerHTML = `
            <p class="response-text">${response}</p>
            <div class="response-meta">
                <span class="response-date">${new Date().toLocaleDateString()}</span>
                <span class="email-badge"><i class="bi bi-envelope-fill"></i> Sent via email</span>
            </div>
        `;
        responsesContainer.appendChild(newResponseItem);
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = 'Response sent successfully!';
        document.querySelector('.main-content .container-fluid').prepend(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
        setTimeout(() => refreshTickets(), 2000);
        setTimeout(() => refreshTickets(), 4000);
    } catch (error) {
        console.error('Error sending response:', error);
        alert(`Failed to send response: ${error.message}`);
    }
});

async function refreshTickets() {
    try {
        const cacheBuster = new Date().getTime();
        const response = await fetch(`${BASE_URL}/api/admin/support/tickets?_=${cacheBuster}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch tickets: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const tickets = await response.json();
        console.log('Fetched tickets:', tickets);
        tickets.forEach(ticket => console.log(`Ticket ${ticket.ticketId} status: ${ticket.status}`));

        const tbody = document.querySelector('#ticketTable tbody');
        if (!tbody) {
            console.error('Ticket table body not found');
            throw new Error('Ticket table body not found');
        }
        tbody.innerHTML = '';
        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.ticketId}</td>
                <td>${ticket.name}</td>
                <td>${ticket.issueType}</td>
                <td>${ticket.date}</td>
                <td class="${ticket.status.toLowerCase() === 'urgent' ? 'text-danger fw-bold' : ''}">${ticket.status}</td>
                <td><button class="btn btn-outline-primary" onclick="viewTicket('${ticket.ticketId}')">View</button></td>
            `;
            tbody.appendChild(row);
        });

        applyFilters();
    } catch (error) {
        console.error('Error refreshing tickets:', error);
        alert(`Failed to fetch tickets: ${error.message}. Please ensure the backend server is running on ${BASE_URL}.`);
    }
}

function applyFilters() {
    const issue = document.getElementById('issueFilter').value;
    const name = document.getElementById('nameFilter').value.toLowerCase();

    const rows = document.querySelectorAll('#ticketTable tbody tr');
    rows.forEach(row => {
        if (row.cells.length < 3) return;
        const ticketIssue = row.cells[2].textContent;
        const ticketName = row.cells[1].textContent.toLowerCase();

        const issueMatch = !issue || ticketIssue === issue;
        const nameMatch = !name || ticketName.includes(name);

        row.style.display = (issueMatch && nameMatch) ? '' : 'none';
    });
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function showNotifications() {
    const urgentRows = document.querySelectorAll('#ticketTable tr td.text-danger');
    alert(`You have ${urgentRows.length} urgent tickets.`);
}

function logout() {
    window.location.href = '/admin/login';
}

document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('ticketModal');

    modalElement.addEventListener('show.bs.modal', () => {
        modalElement.removeAttribute('inert');
    });

    modalElement.addEventListener('hide.bs.modal', () => {
        modalElement.setAttribute('inert', '');
    });

    refreshTickets();
    
});