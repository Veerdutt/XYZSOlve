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


