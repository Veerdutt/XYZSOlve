/* ================= CENTRAL STATE & LOGIC ================= */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Core UI Init
    initNavigation();
    initFAQ();
    updateAuthUI();

    // 2. Page Specific Init
    const path = window.location.pathname;
    if (document.getElementById('signInForm') || document.getElementById('signUpForm')) initAuthPage();
    if (document.getElementById('projectList')) initDashboardPage();
    if (document.getElementById('serviceRequestForm')) initServicePage();
    if (document.getElementById('proceedToCheckoutBtn')) initReviewPage();
    if (document.getElementById('payNowBtn')) initCheckoutPage();
});

/* ===== NAVIGATION LOGIC ===== */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const nav = document.querySelector('nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            mobileNav.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    window.addEventListener('scroll', () => {
        if (nav) {
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        }
    });
}

/* ===== FAQ ACCORDION ===== */
function initFAQ() {
    const questions = document.querySelectorAll(".faq-question");
    questions.forEach(q => {
        q.addEventListener("click", () => {
            const answer = q.nextElementSibling;
            const icon = q.querySelector("i");
            answer.classList.toggle("show");
            if (icon) {
                icon.classList.toggle("fa-plus");
                icon.classList.toggle("fa-minus");
            }
        });
    });
}

/* ================= AUTHENTICATION LOGIC ================= */

function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authLinkDesktop = document.getElementById('authLinkDesktop');
    const authLinkMobile = document.getElementById('authLinkMobile');

    if (currentUser) {
        const userDisplay = currentUser.name.split(' ')[0];
        
        if (authLinkDesktop) {
            authLinkDesktop.innerHTML = `<i class="fas fa-user-circle"></i> ${userDisplay}`;
            authLinkDesktop.href = "dashboard.html";
            
            const navMenu = authLinkDesktop.parentElement.parentElement;
            if (!document.getElementById('logoutBtnDesktop')) {
                const logoutLi = document.createElement('li');
                logoutLi.innerHTML = `<a href="#" id="logoutBtnDesktop" style="color: #ff4757; margin-left: 10px;"><i class="fas fa-sign-out-alt"></i></a>`;
                navMenu.appendChild(logoutLi);
                document.getElementById('logoutBtnDesktop').addEventListener('click', handleLogout);
            }
        }

        if (authLinkMobile) {
            authLinkMobile.innerHTML = `<i class="fas fa-user-circle"></i> Dashboard (${userDisplay})`;
            authLinkMobile.href = "dashboard.html";
        }
    }
}

function handleLogout(e) {
    if (e) e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

function initAuthPage() {
    const container = document.getElementById('auth-container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');

    if (registerBtn && loginBtn && container) {
        registerBtn.addEventListener('click', () => container.classList.add("active"));
        loginBtn.addEventListener('click', () => container.classList.remove("active"));
    }

    // Mobile Toggles
    const mobileRegister = document.getElementById('mobile-register');
    const mobileLogin = document.getElementById('mobile-login');
    if (mobileRegister) mobileRegister.addEventListener('click', () => container.classList.add("active"));
    if (mobileLogin) mobileLogin.addEventListener('click', () => container.classList.remove("active"));

    // Password Show/Hide Toggle
    const toggles = document.querySelectorAll('.toggle-password');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

    if (signUpForm) {
        signUpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signUpName').value;
            const email = document.getElementById('signUpEmail').value;
            const password = document.getElementById('signUpPassword').value;
            const users = getUsers();
            if (users.find(u => u.email === email)) { alert('Email already registered!'); return; }
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Account created! Please Sign In.');
            container.classList.remove("active");
        });
    }

    if (signInForm) {
        signInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signInEmail').value;
            const password = document.getElementById('signInPassword').value;
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
                window.location.href = 'dashboard.html';
            } else { alert('Invalid email or password.'); }
        });
    }
}

/* ================= SERVICE & PRICING LOGIC ================= */

const servicePrices = {
    "Web Development": { Basic: 9999, Standard: 24999, Premium: 49999 },
    "Mobile Development": { Basic: 19999, Standard: 39999, Premium: 79999 },
    "E-commerce Solutions": { Basic: 24999, Standard: 49999, Premium: 89999 },
    "UI/UX Design": { Basic: 7999, Standard: 14999, Premium: 24999 },
    "Backend Development": { Basic: 14999, Standard: 29999, Premium: 59999 },
    "SEO Optimization": { Basic: 4999, Standard: 9999, Premium: 19999 },
    "Website Maintenance": { Basic: 2999, Standard: 5999, Premium: 9999 },
    "Security Solutions": { Basic: 19999, Standard: 34999, Premium: 64999 }
};

const serviceAddons = {
    "Web Development": ["CMS Integration", "Speed Optimization", "Security Hardening"],
    "Mobile Development": ["Push Notifications", "App Store Deployment", "Analytics Integration"],
    "E-commerce Solutions": ["Payment Gateway Setup", "Product Upload (50 items)", "Inventory System"],
    "UI/UX Design": ["Design System", "Interactive Prototype", "User Research"],
    "Backend Development": ["API Development", "Database Optimization", "Cloud Deployment"],
    "SEO Optimization": ["Keyword Research", "Technical SEO Audit", "Monthly Report"],
    "Website Maintenance": ["Monthly Updates", "Security Monitoring", "Backup Service"]
};

const packageDescriptions = {
    "Web Development": {
        Basic: ["Up to 3 pages", "Responsive design", "Basic SEO", "Delivery: 7 days"],
        Standard: ["Up to 7 pages", "Modern UI design", "Advanced SEO", "Delivery: 10–12 days"],
        Premium: ["Unlimited pages", "Custom design", "Full SEO", "Performance optimization", "Delivery: 15 days"]
    },
    "Mobile Development": {
        Basic: ["Single platform (Android or iOS)", "Basic UI", "Delivery: 14 days"],
        Standard: ["Cross-platform (Flutter/React Native)", "Standard UI/UX", "Delivery: 21 days"],
        Premium: ["Cross-platform", "Premium UI/UX", "API Integration", "Delivery: 30 days"]
    },
    "E-commerce Solutions": {
        Basic: ["Simple store", "Up to 10 products", "Delivery: 10 days"],
        Standard: ["Full-featured store", "Up to 50 products", "Delivery: 20 days"],
        Premium: ["Enterprise store", "Unlimited products", "Custom features", "Delivery: 30 days"]
    },
    "UI/UX Design": {
        Basic: ["Single page design", "Source file", "Delivery: 3 days"],
        Standard: ["Up to 5 pages", "Interactive prototype", "Delivery: 7 days"],
        Premium: ["Full App/Web design", "Design system", "Delivery: 14 days"]
    },
    "Backend Development": {
        Basic: ["Simple API", "Database setup", "Delivery: 7 days"],
        Standard: ["Scalable architecture", "Auth system", "Delivery: 14 days"],
        Premium: ["Complex system", "Microservices", "Cloud setup", "Delivery: 21 days"]
    },
    "SEO Optimization": {
        Basic: ["On-page SEO", "Keywords (5)", "Delivery: 7 days"],
        Standard: ["Full SEO Audit", "Keywords (15)", "Delivery: 14 days"],
        Premium: ["Complete Strategy", "Backlink plan", "Delivery: 30 days"]
    },
    "Website Maintenance": {
        Basic: ["Content updates", "Security patch", "Monthly"],
        Standard: ["Performance check", "Speed audit", "Monthly"],
        Premium: ["24/7 Monitoring", "Daily backups", "Priority support"]
    },
    "Security Solutions": {
        Basic: ["SSL Setup", "Firewall", "Delivery: 3 days"],
        Standard: ["Security Audit", "Vulnerability scan", "Delivery: 7 days"],
        Premium: ["Compliance setup", "Pentesting", "Incident response"]
    }
};

function initServicePage() {
    const form = document.getElementById('serviceRequestForm');
    if (!form) return;

    // Auto-fill logged-in user data
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        if (document.getElementById('fullName')) document.getElementById('fullName').value = user.name;
        if (document.getElementById('email')) document.getElementById('email').value = user.email;
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pendingOrder = {
            serviceType: document.getElementById('serviceType').value,
            details: document.getElementById('projectDetails').value,
            clientName: document.getElementById('fullName').value,
            clientEmail: document.getElementById('email').value,
            clientPhone: document.getElementById('phone').value,
            clientCompany: document.getElementById('company').value
        };
        localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
        window.location.href = 'review.html';
    });
}

function initReviewPage() {
    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
    if (!pendingOrder) { window.location.href = 'service.html'; return; }

    const prices = servicePrices[pendingOrder.serviceType] || servicePrices["Web Development"];
    const addons = serviceAddons[pendingOrder.serviceType] || serviceAddons["Web Development"];

    // 1. Update Package Prices & Descriptions
    const pkgRadios = document.querySelectorAll('input[name="pkg"]');
    const serviceDetails = packageDescriptions[pendingOrder.serviceType] || packageDescriptions["Web Development"];

    pkgRadios.forEach(radio => {
        if (prices[radio.value]) {
            radio.dataset.price = prices[radio.value];
            const labelPrice = radio.parentElement.querySelector('strong');
            if (labelPrice) labelPrice.textContent = `₹${prices[radio.value].toLocaleString()}`;
        }
        
        // Update descriptions
        const detailsList = radio.parentElement.querySelector('.pkg-details ul');
        if (detailsList && serviceDetails[radio.value]) {
            detailsList.innerHTML = serviceDetails[radio.value].map(feat => `<li>${feat}</li>`).join('');
        }
    });

    // 2. Build Add-ons
    const addonContainer = document.querySelector('.card:last-of-type');
    if (addonContainer && addonContainer.querySelector('h3').textContent === 'Add-ons') {
        const title = addonContainer.querySelector('h3');
        addonContainer.innerHTML = '';
        addonContainer.appendChild(title);
        addons.forEach(name => {
            const label = document.createElement('label');
            label.className = 'addon';
            label.innerHTML = `
                <input type="checkbox" value="${name}" data-price="2500">
                ${name} — ₹2,500
            `;
            addonContainer.appendChild(label);
        });
    }

    // 3. Calculation & Summary
    const displayService = document.getElementById('displayService');
    const summaryService = document.getElementById('summaryService');
    if (displayService) displayService.textContent = pendingOrder.serviceType;
    if (summaryService) summaryService.textContent = pendingOrder.serviceType;

    const radios = document.querySelectorAll('input[name="pkg"]');
    const checkboxes = document.querySelectorAll('.addon input[type="checkbox"]');
    const summaryPackagePrice = document.getElementById('summaryPackagePrice');
    const summaryAddonsPrice = document.getElementById('summaryAddonsPrice');
    const summaryTotalPrice = document.getElementById('summaryTotalPrice');

    // Restore previously selected package and addons if they exist
    if (pendingOrder.package) {
        radios.forEach(radio => {
            if (radio.value === pendingOrder.package) radio.checked = true;
        });
    }
    if (pendingOrder.addons && Array.isArray(pendingOrder.addons)) {
        checkboxes.forEach(checkbox => {
            if (pendingOrder.addons.includes(checkbox.value)) checkbox.checked = true;
        });
    }

    function updateSummary() {
        let pkgPrice = 0;
        let packageName = "";
        radios.forEach(r => { if (r.checked) { pkgPrice = parseInt(r.dataset.price); packageName = r.value; } });

        let addonsPrice = 0;
        let selectedAddons = [];
        checkboxes.forEach(c => { 
            if (c.checked) { 
                addonsPrice += parseInt(c.dataset.price); 
                selectedAddons.push(c.value);
            } 
        });

        summaryPackagePrice.textContent = `₹${pkgPrice.toLocaleString()}`;
        summaryAddonsPrice.textContent = `₹${addonsPrice.toLocaleString()}`;
        summaryTotalPrice.textContent = `₹${(pkgPrice + addonsPrice).toLocaleString()}`;

        pendingOrder.package = packageName;
        pendingOrder.addons = selectedAddons;
        pendingOrder.totalPrice = `₹${(pkgPrice + addonsPrice).toLocaleString()}`;
        localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    }

    radios.forEach(r => r.addEventListener('change', updateSummary));
    checkboxes.forEach(c => c.addEventListener('change', updateSummary));
    updateSummary();

    document.getElementById('proceedToCheckoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'checkout.html';
    });
}

function initCheckoutPage() {
    const payBtn = document.getElementById('payNowBtn');
    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
    
    if (pendingOrder) {
        if (document.getElementById('checkoutServiceName')) document.getElementById('checkoutServiceName').textContent = pendingOrder.serviceType;
        if (document.getElementById('checkoutPackageName')) document.getElementById('checkoutPackageName').textContent = pendingOrder.package;
        if (document.getElementById('checkoutTotalPrice')) document.getElementById('checkoutTotalPrice').textContent = pendingOrder.totalPrice;
        
        // Render Addons
        const addonsContainer = document.getElementById('checkoutAddonsContainer');
        if (addonsContainer && pendingOrder.addons && pendingOrder.addons.length > 0) {
            addonsContainer.innerHTML = '';
            pendingOrder.addons.forEach(addon => {
                const item = document.createElement('div');
                item.className = 'summary-item';
                item.style.fontSize = '0.9rem';
                item.style.opacity = '0.8';
                item.innerHTML = `
                    <span>+ ${addon}</span>
                    <span>Included</span>
                `;
                addonsContainer.appendChild(item);
            });
        }
        
        // Auto-fill from pendingOrder
        if (document.getElementById('checkoutName')) document.getElementById('checkoutName').value = pendingOrder.clientName || '';
        if (document.getElementById('checkoutEmail')) document.getElementById('checkoutEmail').value = pendingOrder.clientEmail || '';
        if (document.getElementById('checkoutPhone')) document.getElementById('checkoutPhone').value = pendingOrder.clientPhone || '';
        if (document.getElementById('checkoutCompany')) document.getElementById('checkoutCompany').value = pendingOrder.clientCompany || '';
    }

    // Expiry Date Auto-slash Formatter
    const expiryInput = document.getElementById('checkoutExpiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 2) {
                value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Auto-fill logged-in user data
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        if (document.getElementById('checkoutName')) document.getElementById('checkoutName').value = user.name;
        if (document.getElementById('checkoutEmail')) document.getElementById('checkoutEmail').value = user.email;
    }

    if (!payBtn) return;
    payBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Validation logic
        let isValid = true;
        const fields = [
            { id: 'checkoutName', msg: 'Please enter your full name.' },
            { id: 'checkoutEmail', msg: 'Please enter a valid email address.' },
            { id: 'checkoutPhone', msg: 'Please enter your phone number.' },
            { id: 'checkoutCompany', msg: 'Please enter your company name.' },
            { id: 'checkoutCard', msg: 'Please enter a valid 16-digit card number.', validate: val => val.length === 16 && !isNaN(val) },
            { id: 'checkoutExpiry', msg: 'Invalid expiry (MM / YY).', validate: val => val.includes('/') && val.length === 7 },
            { id: 'checkoutCVV', msg: 'Invalid CVV (3 digits).', validate: val => val.length === 3 && !isNaN(val) }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorSpan = document.getElementById(`err-${field.id}`);
            const value = input.value.trim();
            
            let fieldValid = value !== '';
            if (fieldValid && field.validate) fieldValid = field.validate(value);

            if (!fieldValid) {
                input.classList.add('invalid');
                if (errorSpan) {
                    errorSpan.textContent = field.msg;
                    errorSpan.style.display = 'block';
                }
                isValid = false;
            } else {
                input.classList.remove('invalid');
                if (errorSpan) errorSpan.style.display = 'none';
            }
        });

        if (!isValid) return;

        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) { alert('Please sign in.'); window.location.href = 'signin.html'; return; }

        const orderData = {
            userEmail: user.email,
            clientName: name,
            clientPhone: document.getElementById('checkoutPhone').value,
            clientCompany: document.getElementById('checkoutCompany').value,
            service: pendingOrder ? pendingOrder.serviceType : 'Web Development Service',
            package: pendingOrder ? pendingOrder.package : 'Standard',
            addons: pendingOrder ? (pendingOrder.addons || []) : [],
            requirements: pendingOrder ? (pendingOrder.details || 'No details provided.') : 'No details provided.',
            price: pendingOrder ? pendingOrder.totalPrice : '₹30,000',
            date: new Date().toLocaleDateString(),
            id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            status: 'pending'
        };

        const allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
        allProjects.push(orderData);
        localStorage.setItem('allProjects', JSON.stringify(allProjects));
        localStorage.removeItem('pendingOrder');
        alert('Order placed successfully!');
        window.location.href = 'dashboard.html';
    });
}

/* ================= DASHBOARD LOGIC ================= */

function initDashboardPage(filterStatus = 'all') {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    // 1. Profile Info
    if (document.getElementById('userName')) document.getElementById('userName').textContent = user.name;
    if (document.getElementById('userEmail')) document.getElementById('userEmail').textContent = user.email;
    if (document.getElementById('userInitial')) document.getElementById('userInitial').textContent = user.name.charAt(0).toUpperCase();

    // 2. Data Load & Cleanup
    let allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
    
    // One-time cleanup: Remove the known fake project IDs if they exist
    const fakeIds = ['ORD-128472', 'ORD-992831', 'ORD-442109'];
    const cleanedProjects = allProjects.filter(p => !fakeIds.includes(p.id));
    
    if (cleanedProjects.length !== allProjects.length) {
        localStorage.setItem('allProjects', JSON.stringify(cleanedProjects));
        allProjects = cleanedProjects;
    }

    let userProjects = allProjects.filter(p => p.userEmail === user.email);
    
    // Apply Filter if not 'all'
    if (filterStatus !== 'all') {
        userProjects = userProjects.filter(p => (p.status || 'pending') === filterStatus);
    }
    
    // 3. Stats
    if(document.getElementById('statProjects')) document.getElementById('statProjects').textContent = allProjects.filter(p => p.userEmail === user.email).length;
    if(document.getElementById('activeTasks')) document.getElementById('activeTasks').textContent = allProjects.filter(p => p.userEmail === user.email && (p.status || 'pending') === 'active').length; 
    if(document.getElementById('pendingOrders')) document.getElementById('pendingOrders').textContent = allProjects.filter(p => p.userEmail === user.email && (p.status || 'pending') === 'pending').length; 

    // 4. Render Project List
    const projectList = document.getElementById('projectList');
    if (projectList) {
        if (userProjects.length > 0) {
            projectList.innerHTML = ''; 
            userProjects.forEach(project => {
                const statusClass = project.status || 'pending';
                const card = document.createElement('div');
                card.className = 'project-row-bento';
                card.style.cursor = 'pointer';
                card.onclick = () => window.location.href = `project-detail.html?id=${project.id}`;
                card.innerHTML = `
                    <div style="flex:1">
                        <h5 style="font-weight: 700; margin-bottom: 2px;">${project.service}</h5>
                        <span style="color: var(--text-sub); font-size: 0.8rem;">ID: ${project.id} • ${project.date}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1.5rem;">
                        <span class="status-tag ${statusClass}">${statusClass}</span>
                        <strong style="color: var(--accent-blue); font-size: 1.1rem;">${project.price}</strong>
                        <button onclick="event.stopPropagation(); cancelOrder('${project.id}')" style="background: none; border: none; color: #ff4757; cursor: pointer; padding: 5px; transition: 0.2s;" title="Cancel Order">
                            <i class="fas fa-times-circle" style="font-size: 1.2rem;"></i>
                        </button>
                    </div>
                `;
                projectList.appendChild(card);
            });
        } else {
            projectList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-sub);">
                    <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>${filterStatus === 'all' ? 'No active projects found.' : `No ${filterStatus} projects found.`}</p>
                </div>
            `;
        }
    }

    // 5. Dropdown Toggle Logic
    const toggle = document.getElementById('filterToggle');
    const dropdown = document.getElementById('filterDropdown');
    if (toggle && dropdown) {
        toggle.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        };
        document.onclick = () => dropdown.classList.remove('active');
    }
}

function filterProjects(status) {
    const dropdown = document.getElementById('filterDropdown');
    if (dropdown) dropdown.classList.remove('active');
    initDashboardPage(status);
}

function cancelOrder(orderId) {
    if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
        let allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
        allProjects = allProjects.filter(p => p.id !== orderId);
        localStorage.setItem('allProjects', JSON.stringify(allProjects));
        
        // Reload the page automatically as requested
        window.location.reload();
    }
}

function initProjectDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    if (!projectId) { window.location.href = 'dashboard.html'; return; }

    const allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
    const project = allProjects.find(p => p.id === projectId);

    if (!project) {
        alert('Project not found.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Render Basic Info
    document.getElementById('detProjectTitle').textContent = project.service;
    document.getElementById('detOrderId').textContent = `Order ID: ${project.id}`;
    document.getElementById('detDate').textContent = project.date;
    document.getElementById('detPrice').textContent = project.price;
    document.getElementById('detPackage').textContent = project.package || 'Standard';

    // Status & Bento 3.0 Progress Bar
    const status = (project.status || 'pending').toLowerCase();
    const statusLabel = document.getElementById('detStatusLabel');
    const progressFill = document.getElementById('detProgressFill');
    
    if (statusLabel) statusLabel.textContent = status;
    
    if (progressFill) {
        if (status === 'active') {
            progressFill.style.width = '60%';
            document.getElementById('label-2').classList.add('active');
            document.getElementById('label-1').classList.add('active');
            document.getElementById('label-0').classList.add('active');
        } else if (status === 'success') {
            progressFill.style.width = '100%';
            for(let i=0; i<=4; i++) document.getElementById(`label-${i}`).classList.add('active');
        } else {
            progressFill.style.width = '20%';
            document.getElementById('label-0').classList.add('active');
        }
    }

    // Requirements
    document.getElementById('detRequirements').textContent = project.requirements || 'No requirements provided.';

    // Client Info: Prioritize Order Data
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    const clientName = project.clientName || user.name || 'User Name';
    const clientEmail = project.userEmail || user.email || 'user@example.com';
    const clientCompany = project.clientCompany || (user.company || 'Personal Project'); 
    const clientPhone = project.clientPhone || (user.phone || 'Contact Not Provided');

    if (document.getElementById('detUserName')) document.getElementById('detUserName').textContent = clientName;
    if (document.getElementById('detUserEmail')) document.getElementById('detUserEmail').textContent = clientEmail;
    if (document.getElementById('detCompany')) document.getElementById('detCompany').textContent = clientCompany;
    if (document.getElementById('detPhone')) document.getElementById('detPhone').textContent = clientPhone;
    if (document.getElementById('detUserInitial')) document.getElementById('detUserInitial').textContent = clientName.charAt(0).toUpperCase();

    // Addons
    const invBtn = document.getElementById('invoiceBtn');
    if (invBtn) {
        invBtn.onclick = () => {
            window.open(`invoice.html?id=${projectId}`, '_blank');
        };
    }
    const addonsList = document.getElementById('detAddonsList');
    if (addonsList && project.addons && project.addons.length > 0) {
        addonsList.innerHTML = '';
        project.addons.forEach(addon => {
            const span = document.createElement('span');
            span.style.background = 'rgba(99, 102, 241, 0.1)';
            span.style.color = 'var(--accent-blue)';
            span.style.padding = '6px 15px';
            span.style.borderRadius = '100px';
            span.style.fontSize = '0.85rem';
            span.style.fontWeight = '700';
            span.textContent = addon;
            addonsList.appendChild(span);
        });
    } else {
        addonsList.innerHTML = '<span style="color: var(--text-sub);">No extra add-ons selected.</span>';
    }
}

function initContactPage() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const contactForm = document.getElementById('contactForm');
    
    if (user) {
        if (document.getElementById('contactName')) document.getElementById('contactName').value = user.name;
        if (document.getElementById('contactEmail')) document.getElementById('contactEmail').value = user.email;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you! Your message has been sent. We will get back to you within 24 hours.');
                contactForm.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                if (user) {
                    document.getElementById('contactName').value = user.name;
                    document.getElementById('contactEmail').value = user.email;
                }
            }, 1500);
        });
    }
}

function initInvoicePage() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    if (!projectId) { window.location.href = 'dashboard.html'; return; }

    const allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
    const project = allProjects.find(p => p.id === projectId);

    if (!project) {
        alert('Invoice not found.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Render Invoice Header
    document.getElementById('invId').textContent = `#${project.id}`;
    document.getElementById('invDate').textContent = `Date: ${project.date}`;

    // Render Bill To
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    document.getElementById('invName').textContent = project.clientName || user.name || 'Client Name';
    document.getElementById('invCompany').textContent = project.clientCompany || (user.company || 'Personal Project');
    document.getElementById('invPhone').textContent = project.clientPhone || (user.phone || 'N/A');
    document.getElementById('invEmail').textContent = project.userEmail || user.email || 'N/A';

    // Render Items Table
    const itemsBody = document.getElementById('invItems');
    if (itemsBody) {
        itemsBody.innerHTML = '';
        
        // Base Package
        const baseRow = document.createElement('tr');
        baseRow.innerHTML = `
            <td><strong>${project.service}</strong><br><small style="color:#64748b">${project.package || 'Standard'} Package</small></td>
            <td style="text-align: right;">${project.price}</td>
        `;
        itemsBody.appendChild(baseRow);

        // Addons
        if (project.addons && project.addons.length > 0) {
            project.addons.forEach(addon => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>+ ${addon}</td>
                    <td style="text-align: right;">Included</td>
                `;
                itemsBody.appendChild(row);
            });
        }
    }

    // Totals
    document.getElementById('invSubtotal').textContent = project.price;
    document.getElementById('invTotal').textContent = project.price;
}
