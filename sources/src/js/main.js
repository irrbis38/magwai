const body = document.body;
const menu = document.querySelector(".header__menu");

// show / hide mobile menu by .header__burger click
function burgerToggle(body, menu) {
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
    body.classList.remove("lock");
  } else {
    menu.classList.add("active");
    body.classList.add("lock");
  }
}

// .header__burger handler to add / remove event listeners
function burgerHandler() {
  requestAnimationFrame(() => burgerToggle(body, menu));
}

document.addEventListener("DOMContentLoaded", function (event) {
  const burgerBtn = document.querySelector(".header__burger");

  if (window.innerWidth <= 1599) {
    burgerBtn.addEventListener("click", burgerHandler);
  }

  const mq1599 = window.matchMedia("(max-width: 1599px)");

  mq1599.addEventListener("change", handleMQ);

  function handleMQ(e) {
    if (e.matches) {
      burgerBtn.addEventListener("click", burgerHandler);
    } else {
      burgerBtn.removeEventListener("click", burgerHandler);
      menu.classList.remove("active");
      body.classList.remove("lock");
    }
  }
});
