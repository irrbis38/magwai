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
const inputs = Array.from(document.querySelectorAll(".popup__input"));

function addErrorMsg(input, msg) {
  input.parentElement.nextElementSibling.classList.add("error");
  const errorMessage = input.parentElement.previousElementSibling;
  errorMessage.textContent = msg;
  errorMessage.classList.add("active");
}

function showError(input) {
  if (input.name === "name") {
    if (input.validity.valueMissing) {
      addErrorMsg(input, "Fill in the 'name' fild.");
    } else if (input.validity.tooShort) {
      addErrorMsg(input, "Name should be at least 3 characters.");
    }
  } else if (input.name === "phone") {
    if (input.value.includes("_")) {
      addErrorMsg(input, "Type correct phone number.");
    }
  }
}

// === CARDS

// create card

function createCard(post) {
  let num = post.id % 10 === 0 ? 1 : post.id % 10;
  const card = document.createElement("DIV");
  card.classList.add("cards__item", "card");
  card.innerHTML = `
  <div class="card__picture"><img src="./images/cards/card-${num}.png" alt=""/></div>
  <div class="card__descr">
    <div class="card__intro">
      <h3 class="card__heading">nature</h3>
      <p class="card__subheading">How to increase your productivity with a Music</p>
    </div>
    <p class="card__text">${post.body}</p>
    <div class="card__additional">
      <p class="card__info">Posted by <b class="card__author">Eugenia</b>, on <span class="card__date">July  24, 2019</span></p><a class="card__continue" href="#">Continue reading</a>
    </div>
  </div>
  `;

  return card;
}

let postsData = [];
let counter = 1;
const cardsWrapper = document.querySelector(".cards__wrapper");

function renderCards(postsData, container) {
  if (counter < 21) {
    const cards = document.createDocumentFragment();

    let max = counter + 5;

    while (counter < max) {
      const card = createCard(postsData[counter]);
      cards.append(card);
      counter += 1;
    }

    container.append(cards);

    if (counter >= 21) {
      const cardsMoreBtn = document.querySelector(".cards__more");
      cardsMoreBtn.classList.add("disabled");
    }
  }
}

function loadMoreHandler() {
  if (postsData.length === 0) {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => {
        postsData = [postsData].concat(json);
        renderCards(postsData, cardsWrapper);
      });
  } else {
    renderCards(postsData, cardsWrapper);
  }
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

  function clearError(input) {
    const errorMessage = input.parentElement.previousElementSibling;
    errorMessage.textContent = "";
    errorMessage.className = "popup__error";
    input.parentElement.nextElementSibling.classList.remove("error");
  }

  inputs.forEach((input) =>
    input.addEventListener("input", () => {
      if (input.name === "name" && input.validity.valid) {
        clearError(input);
      } else if (input.name === "phone" && input.value.includes("_")) {
        clearError(input);
      } else {
        showError(input);
      }
    })
  );

  form.addEventListener("submit", function (event) {
    inputs.forEach((input) => {
      if (input.name === "name") {
        if (!input.validity.valid) {
          event.preventDefault();
          showError(input);
        }
      } else if (input.name === "phone" && input.value.includes("_")) {
        event.preventDefault();
        showError(input);
      }
    });
  });

  // ADD PHONE MASK LISTENER

  const phoneInput = document.getElementById("phoneInput");

  const maskOptions = {
    mask: "+{7}(000)000-00-00",
    lazy: false,
  };
  const mask = new IMask(phoneInput, maskOptions);

  // LOAD MORE CARDS

  const cardsMoreBtn = document.querySelector(".cards__more");

  cardsMoreBtn.addEventListener("click", () => {
    loadMoreHandler();
  });

  // start animations

  function removeAnimate() {
    body.classList.remove("animated");
  }

  setTimeout(removeAnimate, 100);
});
