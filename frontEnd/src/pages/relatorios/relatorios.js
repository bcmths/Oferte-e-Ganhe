function gerarRelatorio(endpoint) {
    const url = `http://localhost:8000/api/generate_csv/${endpoint}`;
    window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("sidebar-toggle");
  
    toggleButton.addEventListener("click", (event) => {
      event.stopPropagation();
      sidebar.classList.toggle("active");
    });
  
    document.addEventListener("click", (event) => {
      if (
        !sidebar.contains(event.target) &&
        !toggleButton.contains(event.target)
      ) {
        sidebar.classList.remove("active");
      }
    });
  });
  