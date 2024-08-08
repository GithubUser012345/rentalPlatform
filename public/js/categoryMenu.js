document.addEventListener("DOMContentLoaded", () => {
    const categoryDropdown = document.getElementById("categoryDropdown");
    const categoryMenu = document.getElementById("categoryMenu");
    const selectedCategoryInput = document.getElementById("selectedCategory");
    const form = categoryDropdown.closest("form");

    categoryMenu.addEventListener("click", (event) => {
        if (event.target.classList.contains("dropdown-item")) {
            event.preventDefault(); // Prevent the default action of the anchor tag
            const category = event.target.getAttribute("data-value");
            categoryDropdown.textContent = category;
            selectedCategoryInput.value = category;
            categoryDropdown.classList.remove("is-invalid"); // bootstrap form validation class
        }
    });

    form.addEventListener("submit", (event) => {
        if (!selectedCategoryInput.value) {
            categoryDropdown.classList.add("is-invalid");
            event.preventDefault();
        }
    });
});