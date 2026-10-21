(() => {
  const currentPath = window.location.pathname;
  const isSystemAnalyst = currentPath.includes("/system-analyst/");

  const componentPath = isSystemAnalyst
    ? "../components/"
    : "components/";

  document.documentElement.classList.add("js");

  // Load shared header and footer
  async function loadSharedComponents() {
    try {
      const [headerResponse, footerResponse] = await Promise.all([
        fetch(`${componentPath}header.html`),
        fetch(`${componentPath}footer.html`)
      ]);

      if (!headerResponse.ok || !footerResponse.ok) {
        throw new Error("Header atau footer tidak ditemukan.");
      }

      const [headerHTML, footerHTML] = await Promise.all([
        headerResponse.text(),
        footerResponse.text()
      ]);

      const headerPlaceholder =
        document.getElementById("header-placeholder");

      const footerPlaceholder =
        document.getElementById("footer-placeholder");

      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
      }

      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
      }

      // Footer year
      const yearElement = document.getElementById("year");

      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }

      // Navigation links
      updateHeaderLinks();

      // Mobile menu
      setupMobileMenu();

      // Apply saved language
      const savedLanguage =
        localStorage.getItem("portfolio-language") || "en";

      translatePage(savedLanguage);

    } catch (error) {
      console.error("Gagal memuat header/footer:", error);
    }
  }

  // Mobile navigation
  function setupMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const siteNav = document.getElementById("siteNav");

    if (!menuToggle || !siteNav) return;

    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Adjust links on nested pages
  function updateHeaderLinks() {
    if (!isSystemAnalyst) return;

    document.querySelectorAll(".nav-links a").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href) return;

      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("#") ||
        href.startsWith("../") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      link.setAttribute(
        "href",
        "../" + href.replace(/^\.?\//, "")
      );
    });
  }

  // Translate page
  function translatePage(language) {
    document.querySelectorAll("[data-en][data-id]").forEach((element) => {
      const text =
        language === "id"
          ? element.getAttribute("data-id")
          : element.getAttribute("data-en");

      if (text !== null) {
        element.textContent = text;
      }
    });

    document.documentElement.lang =
      language === "id" ? "id" : "en";

    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.getAttribute("data-lang") === language)
      );
    });

    localStorage.setItem("portfolio-language", language);
  }

  // Language buttons
  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const languageButton = target.closest("[data-lang]");

    if (!languageButton) return;

    const language = languageButton.getAttribute("data-lang");

    if (language === "en" || language === "id") {
      translatePage(language);
    }
  });

  // Show page content
  function showPageContent() {
    document.querySelectorAll(".reveal").forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  // Hide broken project images
  function handleProjectImages() {
    document.querySelectorAll(".project-media img").forEach((img) => {
      const hideIfBroken = () => {
        img.style.display = "none";
      };

      img.addEventListener("error", hideIfBroken);

      if (img.complete && img.naturalWidth === 0) {
        hideIfBroken();
      }
    });
  }

  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    showPageContent();
    handleProjectImages();
    loadSharedComponents();
  });
})();
