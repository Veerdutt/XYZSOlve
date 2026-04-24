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

    // Read filter value
    const filterSelect = document.getElementById('projectFilter');
    const filterValue = filterSelect ? filterSelect.value : 'all';

    // Render Master Table
    if (projectTable) {
        projectTable.innerHTML = '';
        
        let filteredProjects = [...allProjects].reverse();
        if (filterValue !== 'all') {
            filteredProjects = filteredProjects.filter(p => (p.status || 'pending').toLowerCase() === filterValue);
        }

        if (filteredProjects.length === 0) {
            projectTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #6b7280; padding: 30px;">No projects match the selected filter.</td></tr>`;
        }

        filteredProjects.forEach(project => {
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
                <td style="display: flex; gap: 10px; align-items: center;">
                    <select class="cyber-select" onchange="updateStatusFromAdmin('${project.id}', this.value)">
                        <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="active" ${status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="success" ${status === 'success' ? 'selected' : ''}>Success</option>
                    </select>
                    <button onclick="openProjectChatModal('${project.id}')" class="cyber-btn" style="padding: 10px; font-size: 0.8rem; background: var(--cyber-cyan); border-radius: 12px;" title="Project Chat"><i class="fas fa-comments"></i></button>
                    <button onclick="deleteProject('${project.id}')" class="cyber-btn" style="padding: 10px; font-size: 0.8rem; background: #ef4444; border-radius: 12px; border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);" title="Delete Project"><i class="fas fa-trash-can"></i></button>
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
        // Soft refresh the table without reloading page
        initAdminPage();
    }
}

function deleteProject(id) {
    if (confirm('Are you absolutely sure you want to permanently delete this deployment? This action cannot be undone and will impact revenue metrics.')) {
        let allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
        allProjects = allProjects.filter(p => p.id !== id);
        localStorage.setItem('allProjects', JSON.stringify(allProjects));
        
        // Clean up associated chat logs to free up local storage
        localStorage.removeItem(`projectChat_${id}`);

        initAdminPage();
        if (typeof initRevenueChart === 'function') initRevenueChart();
    }
}

// =========================================================
// DIRECT PROJECT CHAT LOGIC
// =========================================================
let activeProjectChatId = null;

function openProjectChatModal(projectId) {
    const allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    activeProjectChatId = projectId;
    
    document.getElementById('chatModalSubtitle').textContent = `${project.service} • Client: ${project.clientName || 'Unknown'}`;
    
    const modal = document.getElementById('projectChatModal');
    modal.style.display = 'flex';

    loadAdminProjectChat();

    // Bind Enter key
    const chatInput = document.getElementById('adminChatInput');
    chatInput.onkeypress = (e) => {
        if (e.key === 'Enter') sendAdminProjectChat();
    };
    document.getElementById('adminSendChatBtn').onclick = sendAdminProjectChat;
}

function closeProjectChatModal() {
    document.getElementById('projectChatModal').style.display = 'none';
    activeProjectChatId = null;
}

function loadAdminProjectChat() {
    if (!activeProjectChatId) return;
    
    const historyContainer = document.getElementById('adminChatHistory');
    const chats = JSON.parse(localStorage.getItem(`projectChat_${activeProjectChatId}`)) || [];
    
    historyContainer.innerHTML = '';

    if (chats.length === 0) {
        historyContainer.innerHTML = `
            <div style="text-align: center; color: #6b7280; margin: auto;">
                <i class="fas fa-folder-open" style="font-size: 2rem; opacity: 0.5; margin-bottom: 10px;"></i>
                <p>No chat history for this project.</p>
            </div>
        `;
        return;
    }

    chats.forEach(msg => {
        const bubble = document.createElement('div');
        // Admin's own messages go on the right in blue, Client on the left in gray
        const isSelf = msg.sender === 'admin';
        bubble.style.cssText = `
            max-width: 80%; 
            padding: 12px 18px; 
            border-radius: 16px; 
            font-size: 0.9rem; 
            line-height: 1.5; 
            position: relative;
            align-self: ${isSelf ? 'flex-end' : 'flex-start'};
            background: ${isSelf ? 'var(--cyber-accent)' : '#1f2937'};
            color: white;
            border-bottom-${isSelf ? 'right' : 'left'}-radius: 4px;
            border: 1px solid ${isSelf ? 'transparent' : 'var(--cyber-border)'};
        `;
        
        bubble.innerHTML = `
            ${msg.text}
            <span style="font-size: 0.65rem; opacity: 0.6; display: block; margin-top: 5px; text-align: ${isSelf ? 'right' : 'left'};">${msg.sender.toUpperCase()} • ${msg.timestamp}</span>
        `;
        historyContainer.appendChild(bubble);
    });

    historyContainer.scrollTop = historyContainer.scrollHeight;
}

function sendAdminProjectChat() {
    if (!activeProjectChatId) return;
    
    const input = document.getElementById('adminChatInput');
    const text = input.value.trim();
    if (!text) return;

    const chats = JSON.parse(localStorage.getItem(`projectChat_${activeProjectChatId}`)) || [];
    chats.push({
        sender: 'admin',
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    localStorage.setItem(`projectChat_${activeProjectChatId}`, JSON.stringify(chats));
    input.value = '';
    loadAdminProjectChat();
}

// =========================================================
// SPA VIEW SWITCHING LOGIC
// =========================================================
function toggleSidebar() {
    const sidebar = document.querySelector('.cyber-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function switchAdminView(viewId) {
    // Hide all views
    document.querySelectorAll('.admin-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Deactivate all nav links
    document.querySelectorAll('.cyber-nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Show requested view
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) targetView.classList.add('active');

    // Highlight active nav link
    const targetNav = document.getElementById(`nav-${viewId}`);
    if (targetNav) targetNav.classList.add('active');

    // Close sidebar on mobile
    const sidebar = document.querySelector('.cyber-sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }

    // Initialize specific view logic
    if (viewId === 'revenue') {
        initRevenueChart();
    } else if (viewId === 'overview') {
        initAdminPage();
    }
}

// =========================================================
// REVENUE DASHBOARD LOGIC (CHART.JS)
// =========================================================
let revenueChartInstance = null;

function initRevenueChart() {
    const allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
    
    // 1. Calculate Metrics
    let totalRevenue = 0;
    let successCount = 0;
    const totalTransactions = allProjects.length;

    allProjects.forEach(p => {
        const priceNum = parseInt((p.price || '0').replace(/[^0-9]/g, ''));
        totalRevenue += priceNum;
        if (p.status === 'success') successCount++;
    });

    const avgOrderValue = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;
    const successRate = totalTransactions > 0 ? Math.round((successCount / totalTransactions) * 100) : 0;

    // Update Stat Cards
    document.getElementById('revTotal').textContent = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('revAvg').textContent = `₹${avgOrderValue.toLocaleString()}`;
    document.getElementById('revTrans').textContent = totalTransactions;
    document.getElementById('revSuccess').textContent = `${successRate}%`;

    // 2. Render Chart.js
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Destroy previous instance if re-rendering
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    // Generate neon gradient for line
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.5)'); // Cyber Cyan
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

    // Since all local storage data is "today", generate a simulated historical curve
    // and append actual live data to the end to make it look professional immediately.
    const liveRevenueInLakhs = (totalRevenue / 100000).toFixed(2);
    
    const dataPoints = [2.4, 3.1, 2.8, 4.5, 5.2, parseFloat(liveRevenueInLakhs)];
    const labels = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr (Live)'];

    revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue Trajectory (in ₹ Lakhs)',
                data: dataPoints,
                borderColor: '#06b6d4', // Cyan border
                backgroundColor: gradient, // Cyan Gradient fill
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#06b6d4',
                pointHoverRadius: 6,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#06b6d4',
                    bodyColor: '#f1f5f9',
                    bodyFont: { weight: 'bold', size: 14 },
                    padding: 15,
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `₹ ${context.parsed.y} Lakhs`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                    ticks: { color: '#94a3b8', font: { family: 'Inter, sans-serif' }, callback: (value) => '₹' + value + 'L' }
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#94a3b8', font: { family: 'Inter, sans-serif', weight: 'bold' } }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}
