const body = document.body;
const menu = document.querySelector(".header__menu");

// show / hide elements
function toggleElement(body, el) {
  if (el.classList.contains("active")) {
    el.classList.remove("active");
    body.classList.remove("lock");
  } else {
    el.classList.add("active");
    body.classList.add("lock");
  }
}

// .header__burger handler to add / remove event listeners
function burgerHandler() {
  requestAnimationFrame(() => toggleElement(body, menu));
}

// show  popup

const popup = document.querySelector(".popup");
const requestButtons = document.querySelectorAll(".request__btn");
const closePopup = document.querySelector(".popup__close");

function popupHandler() {
  requestAnimationFrame(() => toggleElement(body, popup));
}

// hide popup

function hidePopup() {
  popup.classList.remove("active");
  body.classList.remove("lock");
}

// hide / show header by scroll

function toggleHeader(itemsToRemoveClassActive) {
  let prevScroll = window.scrollY || document.documentElement.scrollTop;
  let curScroll;
  let direction = 0;
  let prevDirection = 0;

  const header = document.querySelector(".header");

  let checkScroll = function () {
    /*
     ** Find the direction of scroll
     ** 0 - initial, 1 - up, 2 - down
     */

    curScroll = window.scrollY || document.documentElement.scrollTop;
    if (curScroll > prevScroll) {
      //scrolled up
      direction = 2;
    } else if (curScroll < prevScroll) {
      //scrolled down
      direction = 1;
    }

    if (direction !== prevDirection) {
      toggleHeader(direction, curScroll);
    }

    prevScroll = curScroll;
  };

  var toggleHeader = function (direction, curScroll) {
    if (direction === 2 && curScroll > 100) {
      header.classList.add("hide");
      prevDirection = direction;
      // itemsToRemoveClassActive.forEach((item) =>
      //     item.classList.remove("active")
      // );
    } else if (direction === 1) {
      header.classList.remove("hide");
      prevDirection = direction;
    }
  };

  window.addEventListener("scroll", checkScroll);
}

// add / remove class '.fixed' to header by scroll
function addFixedClassToHeader() {
  const header = document.querySelector(".header");

  let startHeight = header.offsetHeight + 300;

  console.log(startHeight);

  window.addEventListener("scroll", function () {
    if (this.scrollY > startHeight) {
      header.classList.add("fixed");
    } else {
      header.classList.remove("fixed");
    }
  });
}

// MAIN

document.addEventListener("DOMContentLoaded", function (event) {
  // burger menu
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

  // show popup
  requestButtons.forEach((btn) => btn.addEventListener("click", popupHandler));

  // hide popup
  closePopup.addEventListener("click", hidePopup);

  // add listeners to header
  toggleHeader();

  // init toggle header to class 'fixed'
  addFixedClassToHeader();
});
