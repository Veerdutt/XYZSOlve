/**
 * XYZSOlve Admin Logic
 * Protected Administrative Functions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Basic Admin Protection Mockup
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.email !== 'admin@xyzsolve.com') {
        alert('Unauthorized Access. Redirecting to home...');
        window.location.href = 'index.html';
        return;
    }
    
    initAdminPage();
});

function initAdminPage() {
    const allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
    const projectTable = document.getElementById('adminProjectTable');
    
    // Calculate Global Stats
    const totalProjects = allProjects.length;
    let totalRevenue = 0;
    let activeCount = 0;

    allProjects.forEach(p => {
        const priceStr = p.price.replace(/[₹,]/g, '');
        totalRevenue += parseInt(priceStr) || 0;
        if (p.status === 'active') activeCount++;
    });

    if(document.getElementById('adminTotalProjects')) document.getElementById('adminTotalProjects').textContent = totalProjects;
    if(document.getElementById('adminTotalRevenue')) document.getElementById('adminTotalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    if(document.getElementById('adminActiveProjects')) document.getElementById('adminActiveProjects').textContent = activeCount;

    // Render Master Table
    if (projectTable) {
        projectTable.innerHTML = '';
        [...allProjects].reverse().forEach(project => {
            const tr = document.createElement('tr');
            const status = (project.status || 'pending').toLowerCase();
            
            tr.innerHTML = `
                <td><span class="id-badge">#${project.id}</span><br><small style="color: #6b7280; font-weight: 700;">${project.date}</small></td>
                <td>
                    <div style="font-weight: 800;">${project.clientName || project.userEmail || 'Unknown Client'}</div>
                    <div style="font-size: 0.8rem; color: #6b7280; font-weight: 600;">${project.clientCompany || 'Personal / No Entity'}</div>
                </td>
                <td>
                    <div style="font-weight: 700;">${project.service}</div>
                    <div style="font-size: 0.8rem; color: var(--cyber-accent); font-weight: 800;">${project.price}</div>
                </td>
                <td><span class="status-pill pill-${status}">${status}</span></td>
                <td>
                    <select class="cyber-select" onchange="updateStatusFromAdmin('${project.id}', this.value)">
                        <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="active" ${status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="success" ${status === 'success' ? 'selected' : ''}>Success</option>
                    </select>
                </td>
            `;
            projectTable.appendChild(tr);
        });
    }

    // Render Support Tickets
    const supportTable = document.getElementById('adminSupportTable');
    const allTickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    if (supportTable) {
        supportTable.innerHTML = '';
        [...allTickets].reverse().forEach(ticket => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="id-badge">${ticket.id}</span><br><small style="color: #6b7280; font-weight: 700;">${ticket.date}</small></td>
                <td>
                    <div style="font-weight: 800;">${ticket.name}</div>
                    <div style="font-size: 0.8rem; color: #6b7280; font-weight: 600;">${ticket.email}</div>
                </td>
                <td><div style="font-weight: 700;">${ticket.subject}</div></td>
                <td><div style="font-size: 0.85rem; max-width: 300px; color: #9ca3af;">${ticket.message}</div></td>
                <td><span class="status-pill ${ticket.status === 'replied' ? 'pill-success' : 'pill-pending'}">${ticket.status}</span></td>
                <td>
                    <button onclick="openReplyModal('${ticket.id}')" 
                       style="background: var(--cyber-accent); color: white; padding: 6px 12px; border: none; border-radius: 8px; font-family: inherit; font-size: 0.75rem; font-weight: 800; display: inline-block; cursor: pointer; transition: 0.2s;">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                </td>
            `;
            supportTable.appendChild(tr);
        });
    }
}

let activeTicketId = null;

function openReplyModal(ticketId) {
    const allTickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    const ticket = allTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    activeTicketId = ticketId;
    document.getElementById('replyTo').value = `${ticket.name} <${ticket.email}>`;
    document.getElementById('replySubject').value = `Re: ${ticket.subject}`;
    document.getElementById('replyMessage').value = '';
    
    const modal = document.getElementById('replyModal');
    modal.style.display = 'flex';
}

function closeReplyModal() {
    const modal = document.getElementById('replyModal');
    modal.style.display = 'none';
    activeTicketId = null;
}

function sendReply() {
    if (!activeTicketId) return;
    
    const message = document.getElementById('replyMessage').value.trim();
    if (!message) {
        alert('Please enter a message before sending.');
        return;
    }

    const btn = document.getElementById('sendReplyBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Encrypting & Sending...';
    btn.style.opacity = '0.7';

    // Simulate network delay and backend processing
    setTimeout(() => {
        let allTickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
        const ticketIndex = allTickets.findIndex(t => t.id === activeTicketId);
        
        if (ticketIndex !== -1) {
            allTickets[ticketIndex].status = 'replied';
            localStorage.setItem('supportTickets', JSON.stringify(allTickets));
        }

        alert('Secure reply dispatched to client successfully.');
        
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        closeReplyModal();
        
        // Refresh the table to show updated status
        initAdminPage();
    }, 1200);
}

function updateStatusFromAdmin(id, newStatus) {
    let allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
    const idx = allProjects.findIndex(p => p.id === id);
    if (idx !== -1) {
        allProjects[idx].status = newStatus;
        localStorage.setItem('allProjects', JSON.stringify(allProjects));
        initAdminPage(); // Instant Refresh
    }
}
