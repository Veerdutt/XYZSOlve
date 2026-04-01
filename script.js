        const questions = document.querySelectorAll(".faq-question");

    questions.forEach(q => {
      q.addEventListener("click", () => {

        const answer = q.nextElementSibling;
        const icon = q.querySelector("i");

        answer.classList.toggle("show");

        icon.classList.toggle("fa-plus");
        icon.classList.toggle("fa-minus");

      });
    });
        
        /* ===== Auth popup toggle ===== */
        const container = document.getElementById('auth-container');
        const registerBtn = document.getElementById('register');
        const loginBtn = document.getElementById('login');

        registerBtn.addEventListener('click', () => container.classList.add("active"));
        loginBtn.addEventListener('click', () => container.classList.remove("active"));

        // Mobile switch links
        const goToSignUp = document.getElementById('goToSignUp');
const goToSignIn = document.getElementById('goToSignIn');

if (goToSignUp) {
    goToSignUp.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add("active");
    });
}

if (goToSignIn) {
    goToSignIn.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.remove("active");
    });
}
        /* ===== Hamburger menu ===== */
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');

        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            mobileNav.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile menu when any link inside it is clicked
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });


