(() => {
    "use strict";

    const doc = document.documentElement;
    const body = document.body;
    const header = document.getElementById("siteHeader");
    const progress = document.getElementById("scrollProgress");
    const backToTop = document.getElementById("backToTop");
    const menuButton = document.getElementById("menuButton");
    const navPanel = document.getElementById("navPanel");
    const themeToggle = document.getElementById("themeToggle");
    const loader = document.getElementById("pageLoader");
    const toast = document.getElementById("toast");
    const modal = document.getElementById("projectModal");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const projectData = {
        "ndps-ecosystem": {
            kicker: "Flagship education ecosystem",
            title: "New Delhi Public School Digital Ecosystem",
            summary: "A connected portfolio of public-facing and administrative experiences designed around the needs of students, parents, teachers, alumni, staff and school leadership.",
            challenge: "School information and administration involve many audiences, permissions and workflows. The challenge was to make those interactions feel organised rather than fragmented.",
            approach: "I treated the website and portals as one ecosystem—using consistent patterns, responsive layouts, role-aware navigation and connected workflows across admissions, records, achievements, alumni and administration.",
            features: ["Public school website and information architecture", "Admission application and status experiences", "Role-based dashboards and protected routes", "Alumni, achievements and notification workflows", "Responsive behaviour for desktop, tablet and mobile"],
            tags: ["Product design", "React", "Node.js", "PostgreSQL", "RBAC", "Responsive UX"]
        },
        records: {
            kicker: "Private data platform",
            title: "NDPS Digital Records Management System",
            summary: "A modular records platform designed to make large student datasets searchable, structured, auditable and usable across academic sessions.",
            challenge: "Paper records and disconnected spreadsheets are difficult to search, update and secure. Historical and current-session information also need different treatment.",
            approach: "The system was structured around student identity, session history, documents, role permissions, audit logs, secure uploads and fast search, with operational safeguards built into the workflow.",
            features: ["Student and academic-session history", "Full-text and filtered search", "JWT authentication and role-based access", "Audit activity and login history", "Secure document handling and data validation", "Designed for 10,000+ student records"],
            tags: ["Express", "PostgreSQL", "Security", "Data architecture", "Audit logs", "Search"]
        },
        automation: {
            kicker: "Workflow automation",
            title: "Smart Data Collection & Automation Suite",
            summary: "A collection of branded Google Apps Script portals that replace repetitive manual collection work with verified, trackable digital workflows.",
            challenge: "Collecting updates from students, former students and faculty can create duplicates, incomplete records and significant follow-up work.",
            approach: "I built purpose-specific portals with validation, secure personal links, one-time submissions, uploads, automatic record creation, acknowledgements and status tracking in Google Workspace.",
            features: ["Student Council application portal", "Alumni and former-student update workflows", "Teacher and faculty data collection", "Student email verification and updates", "Photo and document uploads", "Printable acknowledgements and submission IDs"],
            tags: ["Apps Script", "Google Sheets", "Google Drive", "Gmail", "Validation", "Automation"]
        },
        erp: {
            kicker: "Role-based administration platform",
            title: "School ERP & User Management Platform",
            summary: "A connected school administration environment where every user has a distinct identity, appropriate permissions and a clear workflow, while super administrators retain complete oversight.",
            challenge: "Schools need different experiences for administrators, staff, teachers, students and alumni without duplicating data or exposing functions to the wrong role.",
            approach: "I structured the platform around secure user accounts, granular permissions, role-aware navigation, academic-session logic, shared operational data and detailed audit visibility.",
            features: ["Separate user IDs and secure login workflows", "Role-based dashboards and protected routes", "Teacher, student, staff and administrator access", "Attendance, notifications and academic-session workflows", "Password management and login history", "Super-admin visibility across user activity"],
            tags: ["React", "Node.js", "PostgreSQL", "RBAC", "Authentication", "Audit logs"]
        }
    };

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2300);
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector("i");
        const dark = theme === "dark";
        icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0d1223" : "#f7f9ff");
    }

    const savedTheme = localStorage.getItem("aprojeet-theme");
    if (savedTheme === "dark" || savedTheme === "light") doc.dataset.theme = savedTheme;
    updateThemeIcon(doc.dataset.theme || "light");

    themeToggle?.addEventListener("click", () => {
        const next = doc.dataset.theme === "dark" ? "light" : "dark";
        doc.dataset.theme = next;
        localStorage.setItem("aprojeet-theme", next);
        updateThemeIcon(next);
    });

    window.addEventListener("load", () => {
        window.setTimeout(() => loader?.classList.add("hidden"), reduceMotion ? 0 : 650);
    });
    window.setTimeout(() => loader?.classList.add("hidden"), 3000);

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

    document.querySelectorAll(".reveal").forEach((element) => {
        if (reduceMotion) element.classList.add("visible");
        else revealObserver.observe(element);
    });

    const sections = [...document.querySelectorAll("main section[id]")];
    const navLinks = [...document.querySelectorAll(".nav-link")];

    function updateScrollUI() {
        const scrollTop = window.scrollY || doc.scrollTop;
        const max = doc.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(1, scrollTop / max) : 0;
        if (progress) progress.style.width = `${ratio * 100}%`;
        header?.classList.toggle("scrolled", scrollTop > 20);
        backToTop?.classList.toggle("visible", scrollTop > 600);

        let current = "home";
        sections.forEach((section) => {
            if (scrollTop >= section.offsetTop - 180) current = section.id;
        });
        navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
    }

    window.addEventListener("scroll", updateScrollUI, { passive: true });
    updateScrollUI();

    function closeMenu() {
        navPanel?.classList.remove("open");
        menuButton?.classList.remove("open");
        menuButton?.setAttribute("aria-expanded", "false");
        menuButton?.setAttribute("aria-label", "Open navigation");
        body.classList.remove("menu-open");
    }

    menuButton?.addEventListener("click", () => {
        const open = !navPanel?.classList.contains("open");
        navPanel?.classList.toggle("open", open);
        menuButton.classList.toggle("open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        body.classList.toggle("menu-open", open);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            closeModal();
        }
    });

    backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    const typingTarget = document.getElementById("typingText");
    const phrases = ["school platforms", "digital record systems", "administration workflows", "responsive web products", "automation tools"];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typePhrase() {
        if (!typingTarget) return;
        const phrase = phrases[phraseIndex];
        typingTarget.textContent = phrase.slice(0, charIndex);
        if (!deleting && charIndex < phrase.length) {
            charIndex += 1;
            window.setTimeout(typePhrase, 65);
        } else if (!deleting) {
            deleting = true;
            window.setTimeout(typePhrase, 1450);
        } else if (charIndex > 0) {
            charIndex -= 1;
            window.setTimeout(typePhrase, 28);
        } else {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            window.setTimeout(typePhrase, 320);
        }
    }
    if (!reduceMotion) typePhrase();

    document.querySelectorAll("[data-tilt]").forEach((card) => {
        if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - .5;
            const y = (event.clientY - rect.top) / rect.height - .5;
            card.style.transform = `perspective(1000px) rotateY(${x * 7}deg) rotateX(${y * -7}deg) translateY(-2px)`;
        });
        card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });

    document.querySelectorAll(".capability-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            const id = tab.dataset.tab;
            document.querySelectorAll(".capability-tab").forEach((item) => {
                const active = item === tab;
                item.classList.toggle("active", active);
                item.setAttribute("aria-selected", String(active));
            });
            document.querySelectorAll(".capability-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === id));
        });
    });

    let lastFocusedElement = null;

    function openModal(projectId) {
        const data = projectData[projectId];
        if (!modal || !data) return;
        lastFocusedElement = document.activeElement;
        document.getElementById("projectModalKicker").textContent = data.kicker;
        document.getElementById("projectModalTitle").textContent = data.title;
        document.getElementById("projectModalSummary").textContent = data.summary;
        document.getElementById("projectModalChallenge").textContent = data.challenge;
        document.getElementById("projectModalApproach").textContent = data.approach;

        const features = document.getElementById("projectModalFeatures");
        features.replaceChildren(...data.features.map((feature) => {
            const li = document.createElement("li");
            li.textContent = feature;
            return li;
        }));

        const tags = document.getElementById("projectModalTags");
        tags.replaceChildren(...data.tags.map((tag) => {
            const span = document.createElement("span");
            span.textContent = tag;
            return span;
        }));

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        body.classList.add("modal-open");
        modal.querySelector(".modal-close")?.focus();
    }

    function closeModal() {
        if (!modal?.classList.contains("open")) return;
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        body.classList.remove("modal-open");
        if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
    }

    document.querySelectorAll(".project-open").forEach((button) => button.addEventListener("click", () => openModal(button.dataset.projectId)));
    document.querySelectorAll("[data-close-modal]").forEach((element) => element.addEventListener("click", closeModal));

    modal?.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") return;
        const focusable = [...modal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    document.getElementById("copyEmail")?.addEventListener("click", async (event) => {
        const email = event.currentTarget.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
            showToast("Email address copied");
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = email;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
            showToast("Email address copied");
        }
    });

    const year = document.getElementById("currentYear");
    if (year) year.textContent = new Date().getFullYear();

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
        window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
    }
})();
