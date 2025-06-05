let allTickets = [];

// Debug: Log the value of window.backendUrl
console.log('window.backendUrl:', window.backendUrl);

async function fetchTickets() {
    try {
        const response = await fetch(`${window.backendUrl}/api/admin/support/tickets`, {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
}

//async function refreshTickets() {
  //  try {
    //    allTickets = await fetchTickets();
      //  updateTicketTable(allTickets);
        //updateTicketCounts();
    //} catch (error) {
//        console.error('Error refreshing tickets:', error);
  //      alert('Failed to load tickets. Please ensure the backend server is running on ' + window.backendUrl + '.');
    // }
// }

function updateTicketTable(tickets) {
    const tbody = document.querySelector('#ticketTable tbody');
    tbody.innerHTML = '';

    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.ticketId}</td>
            <td>${ticket.name}</td>
            <td>${ticket.issueType}</td>
            <td class="${ticket.status === 'Urgent' ? 'text-danger fw-bold' : ''}">${ticket.status}</td>
            <td>${ticket.date}</td>
            <td>
                <button class="btn btn-outline-primary" data-ticket-id="${ticket.ticketId}" onclick="viewTicket('${ticket.ticketId}')">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateTicketCounts() {
    const openTickets = allTickets.filter(t => t.status === 'Urgent').length;
    const pendingTickets = allTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
    const closedTickets = allTickets.filter(t => t.status === 'Closed').length;

    document.getElementById('openTickets').textContent = openTickets;
    document.getElementById('pendingTickets').textContent = pendingTickets;
    document.getElementById('closedTickets').textContent = closedTickets;
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const issueFilter = document.getElementById('issueFilter').value;
    const nameFilter = document.getElementById('nameFilter').value.toLowerCase();

    const filteredTickets = allTickets.filter(ticket => {
        const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
        const matchesIssue = issueFilter ? ticket.issueType === issueFilter : true;
        const matchesName = nameFilter ? ticket.name.toLowerCase().includes(nameFilter) : true;

        return matchesStatus && matchesIssue && matchesName;
    });

    updateTicketTable(filteredTickets);
    updateTicketCounts();
}

async function viewTicket(ticketId) {
    try {
        let ticket = allTickets.find(t => t.ticketId === ticketId);
        if (!ticket) {
            const response = await fetch(`${window.backendUrl}/api/admin/support/tickets/${ticketId}`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            ticket = await response.json();
            allTickets.push(ticket); // Add to local cache
        }

        document.getElementById('modalTicketId').textContent = ticket.ticketId;
        document.getElementById('modalName').textContent = ticket.name;
        document.getElementById('modalEmail').textContent = ticket.email;
        document.getElementById('modalPhone').textContent = ticket.phone;
        document.getElementById('modalIssueType').textContent = ticket.issueType;
        document.getElementById('modalStatus').value = ticket.status;
        document.getElementById('modalDate').textContent = ticket.date;
        document.getElementById('modalDescription').textContent = ticket.description;
        document.getElementById('previousResponses').textContent = ticket.responses || 'No responses yet.';
        document.getElementById('responseTicketId').value = ticket.ticketId;

        const modal = new bootstrap.Modal(document.getElementById('ticketModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching ticket:', error);
        alert('Failed to load ticket details. Please ensure the backend server is running on ' + window.backendUrl + '.');
    }
}

async function updateStatus() {
    const ticketId = document.getElementById('modalTicketId').textContent;
    const newStatus = document.getElementById('modalStatus').value;

    try {
        const response = await fetch(`${window.backendUrl}/api/admin/support/tickets/${ticketId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStatus),
            credentials: 'include'
        });

        if (response.ok) {
            await refreshTickets();
        } else {
            alert('Failed to update ticket status.');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update ticket status. Please try again.');
    }
}

async function submitResponse(event) {
    event.preventDefault();

    const form = document.getElementById('responseForm');
    const ticketId = document.getElementById('responseTicketId').value;
    const responseText = form.querySelector('textarea[name="response"]').value;
    const sendAsEmail = form.querySelector('input[name="sendAsEmail"]').checked;

    const ticketResponse = {
        ticketId: ticketId,
        response: responseText,
        sendAsEmail: sendAsEmail
    };

    try {
        const response = await fetch(`${window.backendUrl}/api/admin/support/tickets/response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticketResponse),
            credentials: 'include'
        });

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('ticketModal'));
            modal.hide();
            await refreshTickets();
            alert('Response sent successfully! Ticket has been marked as Closed.');
        } else {
            alert('Failed to send response.');
        }
    } catch (error) {
        console.error('Error submitting response:', error);
        alert('Failed to send response. Please try again.');
    }
}

async function closeTicket() {
    const ticketId = document.getElementById('modalTicketId').textContent;

    try {
        const response = await fetch(`${window.backendUrl}/api/admin/support/tickets/${ticketId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify('Closed'),
            credentials: 'include'
        });

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('ticketModal'));
            modal.hide();
            await refreshTickets();
            alert('Ticket closed successfully.');
        } else {
            alert('Failed to close ticket.');
        }
    } catch (error) {
        console.error('Error closing ticket:', error);
        alert('Failed to close ticket. Please try again.');
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function showNotifications() {
    alert('Notifications feature is not implemented yet.');
}


document.addEventListener('DOMContentLoaded', () => {
    refreshTickets();

    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('issueFilter').addEventListener('change', applyFilters);
    document.getElementById('nameFilter').addEventListener('input', applyFilters);
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
