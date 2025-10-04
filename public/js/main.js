
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navList = document.querySelector("nav ul"); 

  menuToggle.addEventListener("click", () => {
    navList.classList.toggle("show"); // toggle .show class
  });

  // Optional: close menu when a link is clicked (mobile UX)
  navList.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navList.classList.remove("show");
    });
  });
});
