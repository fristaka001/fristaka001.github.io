
(() => {
  // Load shared header
  const headerPlaceholder = document.getElementById("header-placeholder");

  if (headerPlaceholder) {
    fetch("components/header.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal memuat header");
        }
        return response.text();
      })
      .then((html) => {
        headerPlaceholder.innerHTML = html;
        updateHeaderLinks();
      })
      .catch((error) => {
        console.error("Header tidak berhasil dimuat:", error);
      });
  }

  // Load shared footer
  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (footerPlaceholder) {
    fetch("components/footer.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal memuat footer");
        }
        return response.text();
      })
      .then((html) => {
        footerPlaceholder.innerHTML = html;

        const yearElement = document.getElementById("year");

        if (yearElement) {
          yearElement.textContent = new Date().getFullYear();
        }

        translatePage(
          localStorage.getItem("portfolio-language") || "en"
        );
      })
      .catch((error) => {
        console.error("Footer tidak berhasil dimuat:", error);
      });
  }

  // Update header links
  function updateHeaderLinks() {
    const currentPath = window.location.pathname;

    document.querySelectorAll(".nav-links a").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href) return;

      // Sesuaikan link navigasi ke bagian di halaman utama
      if (
        !currentPath.endsWith("/index.html") &&
        currentPath !== "/" &&
        !href.startsWith("http") &&
        !href.startsWith("#")
      ) {
        link.setAttribute("href", "../" + href.replace(/^\.?\//, ""));
      }
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

    document.documentElement.lang = language === "id" ? "id" : "en";

    localStorage.setItem("portfolio-language", language);
  }

  // Language switch buttons
  document.addEventListener("click", (event) => {
    const languageButton = event.target.closest("[data-lang]");

    if (!languageButton) return;

    const language = languageButton.getAttribute("data-lang");

    if (language === "en" || language === "id") {
      translatePage(language);
    }
  });
})();
