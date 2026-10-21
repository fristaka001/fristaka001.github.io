(() => {
  // ------------------------------------------------------------------
  // Path helper: hitung kedalaman folder otomatis
  // ------------------------------------------------------------------
  // Jika situs di-hosting sebagai project page GitHub Pages
  // (user.github.io/nama-repo/), isi BASE_DEPTH dengan 1 supaya nama repo
  // tidak ikut dihitung sebagai folder. Untuk root domain biarkan 0.
  const BASE_DEPTH = 0;

  const dirs = window.location.pathname.split("/").filter(Boolean);
  if (dirs.length && dirs[dirs.length - 1].includes(".")) dirs.pop(); // buang index.html

  const depth = Math.max(0, dirs.length - BASE_DEPTH);
  const prefix = "../".repeat(depth); // "" di root, "../../" di siaga-magang
  const componentPath = `${prefix}components/`;

  document.documentElement.classList.add("js");

  // ------------------------------------------------------------------
  // Kamus terjemahan untuk halaman yang memakai data-i18n
  // (isi nanti; key yang belum ada dilewati, teks asli HTML tetap tampil)
  // ------------------------------------------------------------------
  const translations = {
    en: {
      // hero_label: "Internship readiness",
    },
    id: {
      // hero_label: "Kesiapan magang",
    }
  };

  // ------------------------------------------------------------------
  // Header & footer bersama
  // ------------------------------------------------------------------
  async function loadSharedComponents() {
    try {
      const [headerResponse, footerResponse] = await Promise.all([
        fetch(`${componentPath}header.html`),
        fetch(`${componentPath}footer.html`)
      ]);

      if (!headerResponse.ok || !footerResponse.ok) {
        throw new Error(
          `Header atau footer tidak ditemukan di ${componentPath}`
        );
      }

      const [headerHTML, footerHTML] = await Promise.all([
        headerResponse.text(),
        footerResponse.text()
      ]);

      const headerPlaceholder = document.getElementById("header-placeholder");
      const footerPlaceholder = document.getElementById("footer-placeholder");

      if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
      if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

      const yearElement = document.getElementById("year");
      if (yearElement) yearElement.textContent = new Date().getFullYear();

      updateHeaderLinks();
      setupMobileMenu();

      translatePage(localStorage.getItem("portfolio-language") || "en");
    } catch (error) {
      console.error("Gagal memuat header/footer:", error);
    }
  }

  // ------------------------------------------------------------------
  // Menu mobile
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Sesuaikan link header untuk halaman yang bersarang
  // ------------------------------------------------------------------
  function updateHeaderLinks() {
    if (!prefix) return;

    document.querySelectorAll(".nav-links a, .logo").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || /^(https?:|mailto:|tel:|#|\.\.\/)/.test(href)) return;

      link.setAttribute("href", prefix + href.replace(/^\.?\//, ""));
    });
  }

  // ------------------------------------------------------------------
  // Terjemahan
  // ------------------------------------------------------------------
  function translatePage(language) {
    // Format lama: data-en / data-id
    document.querySelectorAll("[data-en][data-id]").forEach((element) => {
      const text =
        language === "id"
          ? element.getAttribute("data-id")
          : element.getAttribute("data-en");

      if (text !== null) element.textContent = text;
    });

    // Format baru: data-i18n, data-i18n-alt, data-i18n-aria
    const dict = translations[language] || {};

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = dict[element.getAttribute("data-i18n")];
      if (value !== undefined) element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      const value = dict[element.getAttribute("data-i18n-alt")];
      if (value !== undefined) element.setAttribute("alt", value);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const value = dict[element.getAttribute("data-i18n-aria")];
      if (value !== undefined) element.setAttribute("aria-label", value);
    });

    document.documentElement.lang = language === "id" ? "id" : "en";

    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.getAttribute("data-lang") === language)
      );
    });

    localStorage.setItem("portfolio-language", language);
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const languageButton = target.closest("[data-lang]");
    if (!languageButton) return;

    const language = languageButton.getAttribute("data-lang");
    if (language === "en" || language === "id") translatePage(language);
  });

  // ------------------------------------------------------------------
  // Tampilkan konten
  // ------------------------------------------------------------------
  function showPageContent() {
    document.querySelectorAll(".reveal").forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  // ------------------------------------------------------------------
  // Gambar proyek (halaman System Analyst)
  // ------------------------------------------------------------------
  function handleProjectImages() {
    document.querySelectorAll(".project-media img").forEach((img) => {
      const hideIfBroken = () => {
        img.style.display = "none";
      };

      img.addEventListener("error", hideIfBroken);

      if (img.complete && img.naturalWidth === 0) hideIfBroken();
    });
  }

  // ------------------------------------------------------------------
  // Gambar figure (halaman SIAGA)
  // ------------------------------------------------------------------
  function handleFigureImages() {
    const grid = document.getElementById("extrasGrid");

    const refreshExtras = () => {
      if (!grid) return;
      const figures = grid.querySelectorAll(".figure.is-optional");
      grid.hidden = [...figures].every((f) => f.hidden);
    };

    document.querySelectorAll(".figure-media img").forEach((img) => {
      const figure = img.closest(".figure");

      const onBroken = () => {
        img.style.display = "none"; // placeholder tampil kembali
        if (figure && figure.classList.contains("is-optional")) {
          figure.hidden = true; // sembunyikan gambar opsional
        }
        refreshExtras();
      };

      img.addEventListener("error", onBroken);

      if (img.complete && img.naturalWidth === 0) onBroken();
    });
  }

  // ------------------------------------------------------------------
  // Inisialisasi
  // ------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    showPageContent();
    handleProjectImages();
    handleFigureImages();
    loadSharedComponents();
  });
})();
