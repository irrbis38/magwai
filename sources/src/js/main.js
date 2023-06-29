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

  function checkScroll() {
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
  }

  var toggleHeader = function (direction, curScroll) {
    if (direction === 2 && curScroll > 100) {
      header.classList.add("hide");
      prevDirection = direction;
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

  window.addEventListener("scroll", function () {
    if (this.scrollY > startHeight) {
      header.classList.add("fixed");
    } else {
      header.classList.remove("fixed");
    }
  });
}

// form validation

const form = document.querySelector(".popup__form");
const errorMessage = document.querySelector(".popup__error");
const inputs = Array.from(document.querySelectorAll(".popup__input"));

function showError(input) {
  console.log(input.name);

  if (input.name === "name") {
    if (input.validity.valueMissing) {
      input.nextElementSibling.classList.add("error");
      errorMessage.textContent = "Fill in all the required fields.";
    } else if (input.validity.tooShort) {
      input.nextElementSibling.classList.add("error");
      errorMessage.textContent = `Name should be at least ${input.minLength} characters; you entered ${input.value.length}.`;
    }
  } else if (input.name === "phone") {
    if (input.validity.valueMissing) {
      input.nextElementSibling.classList.add("error");
      errorMessage.textContent = "Fill in all the required fields.";
    }
  }

  // show error message
  errorMessage.className = "popup__error active";
}

// phone input mask

function addPhoneMask(e) {
  const el = e.target,
    clearVal = el.dataset.phoneClear,
    pattern = el.dataset.phonePattern,
    matrix_def = "+7(___) ___-__-__",
    matrix = pattern ? pattern : matrix_def,
    i = 0,
    def = matrix.replace(/\D/g, ""),
    val = e.target.value.replace(/\D/g, "");
  if (clearVal !== "false" && e.type === "blur") {
    if (val.length < matrix.match(/([\_\d])/g).length) {
      e.target.value = "";
      return;
    }
  }
  if (def.length >= val.length) val = def;
  e.target.value = matrix.replace(/./g, function (a) {
    return /[_\d]/.test(a) && i < val.length
      ? val.charAt(i++)
      : i >= val.length
      ? ""
      : a;
  });
}

//============ ADD LOGIC BY CONTENT LOAD EVENt ============

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

  // VALIDATION

  inputs.forEach((input) =>
    input.addEventListener("input", () => {
      if (input.validity.valid) {
        errorMessage.textContent = "";
        errorMessage.className = "popup__error";
        input.nextElementSibling.classList.remove("error");
      } else {
        showError(input);
      }
    })
  );

  form.addEventListener("submit", function (event) {
    inputs.forEach((input) => {
      if (!input.validity.valid) {
        event.preventDefault();
        showError(input);
      }
    });
  });

  // ADD PHONE MASK LISTENER

  const phoneInput = document.getElementById("phoneInput");

  for (let event of ["input", "blur", "focus"]) {
    phoneInput.addEventListener(event, addPhoneMask);
  }
});
