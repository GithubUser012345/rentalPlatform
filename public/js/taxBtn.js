//tax
let toggleButton = document.getElementById("flexSwitchCheckDefault");
toggleButton.addEventListener("click", () => {
    let taxInfo = document.querySelectorAll(".tax-info");
    for (let tax of taxInfo) {
        if (tax.style.display !== "inline") {
            tax.style.display = "inline";
        } else {
            tax.style.display = "none";
        }
    }
});