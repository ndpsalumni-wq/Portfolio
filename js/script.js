(() => {
    "use strict";
    const root = document.documentElement;
    const themeButton = document.getElementById("themeToggle");
    const menuButton = document.getElementById("menuButton");
    const panel = document.getElementById("navPanel");
    const links = [...document.querySelectorAll(".nav-link")];
    const sections = [...document.querySelectorAll("main section[id]")];
    const back = document.getElementById("backToTop");
    const toast = document.getElementById("toast");
    function setTheme(theme) {
        root.dataset.theme = theme;
        if (themeButton) {
            themeButton.querySelector("i").className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
            themeButton.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
        }
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#151d1a" : "#f7f7f2");
    }
    let theme = root.dataset.theme || "light";
    try {
        const stored = localStorage.getItem("aprojeet-theme");
        if (stored === "dark" || stored === "light") theme = stored;
    } catch { /* Browsing remains available when storage is blocked. */ }
    setTheme(theme);
    themeButton?.addEventListener("click", () => {
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        setTheme(next);
        try { localStorage.setItem("aprojeet-theme", next); } catch { /* Session-only preference. */ }
    });
    function closeMenu() {
        panel?.classList.remove("open");
        menuButton?.setAttribute("aria-expanded", "false");
        menuButton?.setAttribute("aria-label", "Open navigation");
        document.body.classList.remove("menu-open");
    }
    menuButton?.addEventListener("click", () => {
        const open = !panel.classList.contains("open");
        panel.classList.toggle("open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        document.body.classList.toggle("menu-open", open);
    });
    links.forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && panel?.classList.contains("open")) {
            closeMenu();
            menuButton.focus();
        }
    });
    matchMedia("(min-width: 601px)").addEventListener("change", event => { if (event.matches) closeMenu(); });
    function updateScroll() {
        back?.classList.toggle("visible", scrollY > 600);
        let current = "home";
        sections.forEach(section => { if (section.getBoundingClientRect().top <= 140) current = section.id; });
        links.forEach(link => {
            const active = link.getAttribute("href") === "#" + current;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    }
    addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    back?.addEventListener("click", () => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
    let toastTimer;
    function notify(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
    }
    document.getElementById("copyEmail")?.addEventListener("click", async event => {
        const email = event.currentTarget.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
            notify("Email address copied");
        } catch {
            const field = document.createElement("textarea");
            field.value = email;
            field.style.cssText = "position:fixed;opacity:0";
            document.body.append(field);
            let copied = false;
            try { field.select(); copied = document.execCommand("copy"); } catch { /* Show manual option below. */ }
            finally { field.remove(); }
            notify(copied ? "Email address copied" : "Please use the Email Aprojeet link");
        }
    });
    const year = document.getElementById("currentYear");
    if (year) year.textContent = new Date().getFullYear();
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
        const register = () => navigator.serviceWorker.register("sw.js").catch(() => {});
        if (document.readyState === "complete") register();
        else addEventListener("load", register, { once: true });
    }
})();
