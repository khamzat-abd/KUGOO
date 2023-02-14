const formsTel = document.querySelectorAll(".form-tel");
const formMail = document.querySelector(".form-mail");
const header = document.querySelector(".header");
const seporator = document.querySelector(".seporator-header");
const mMenuToggle = document.querySelector(".mobile-menu-toggle");
const menu = document.querySelector(".mobile-menu");

const openMenu = (event) => {
  // функция открывания меню
  menu.classList.add("is-open"); // вешает класс is-open
  mMenuToggle.classList.add("close-menu");
  document.body.style.overflow = "hidden"; // запрещаем прокрутку сайта под меню
};
const closeMenu = (event) => {
  // функция закрывания меню
  menu.classList.remove("is-open"); // уберает класс is-open
  mMenuToggle.classList.remove("close-menu");
  document.body.style.overflow = ""; // возвращает прокрутку сайта под меню
};

mMenuToggle.addEventListener("click", (event) => {
  event.preventDefault();
  menu.classList.contains("is-open") ? closeMenu() : openMenu();
});

window.addEventListener("scroll", () => {
  if (this.scrollY > 80) {
    header.classList.add("header-fixed");
    seporator.classList.add("seporator-margin");
  } else {
    header.classList.remove("header-fixed");
    seporator.classList.remove("seporator-margin");
  }
});

let currentModal;
let modalContainer;
let alertModal = document.querySelector("#alert-modal");

const modalButtons = document.querySelectorAll("[data-toggle=modal]");
modalButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    currentModal = document.querySelector(button.dataset.target);
    currentModal.classList.toggle("is-open");
    modalContainer = currentModal.querySelector(".modal-container");
    currentModal.addEventListener("click", (event) => {
      if (!event.composedPath().includes(modalContainer)) {
        currentModal.classList.remove("is-open");
      }
    });
  });
});
document.addEventListener("keyup", (event) => {
  if (event.key == "Escape" && currentModal.classList.contains("is-open")) {
    currentModal.classList.toggle("is-open");
  }
});

formsTel.forEach((form) => {
  const validation = new JustValidate(form, {
    errorFieldCssClass: "is-invalid",
  });
  validation
    .addField("[name=userphone]", [
      {
        rule: "required",
        errorMessage: "Укажите телефон",
      },
      {
        rule: "minLength",
        value: 16,
        errorMessage: "Укажите телефон",
      },
    ])
    .addField("[name=ctahighload]", [
      {
        rule: "required",
        errorMessage: " ",
      },
    ])
    .onSuccess((event) => {
      const thisForm = event.target;
      const formData = new FormData(thisForm);
      const ajaxSend = (formData) => {
        fetch(thisForm.getAttribute("action"), {
          method: thisForm.getAttribute("method"),
          body: formData,
        }).then((response) => {
          if (response.ok) {
            thisForm.reset();
            currentModal.classList.remove("is-open");
            alertModal.classList.add("is-open");
            currentModal = alertModal;
            modalContainer = currentModal.querySelector(".modal-container");
            /* отслеживаем клик по пустому полю*/
            currentModal.addEventListener("click", (event) => {
              /* если клик в пустую область */
              if (!event.composedPath().includes(modalContainer)) {
                /* закрываем окно */
                currentModal.classList.remove("is-open");
              }
            });
          } else {
            alert(response.statusText);
          }
        });
      };
      ajaxSend(formData);
    });
});

const validation = new JustValidate(formMail, {
  errorFieldCssClass: "is-invalid",
});
validation
  .addField("[name=usermail]", [
    {
      rule: "required",
      errorMessage: "Укажите email",
    },
    {
      rule: "email",
      errorMessage: "Укажите email правильно!",
    },
  ])
  .onSuccess((event) => {
    const thisForm = event.target;
    const formData = new FormData(thisForm);
    const ajaxSend = (formData) => {
      fetch(thisForm.getAttribute("action"), {
        method: thisForm.getAttribute("method"),
        body: formData,
      }).then((response) => {
        if (response.ok) {
          thisForm.reset();
          alert("Форма отправлена");
        } else {
          alert("Ошибка");
        }
      });
    };
    ajaxSend(formData);
  });

/* Создаем префикс +7, даже если вводят 8 или 9 */
const prefixNumber = (str) => {
  /* если вводят семерку, добавляем ей скобку */
  if (str === "7") {
    return "7 (";
  }
  /* если вводят восьмерку, ставим вместо нее +7 ( */
  if (str === "8") {
    return "+7 (";
  }
  /* если пишут девятку, заменяем на +7 (9  */
  if (str === "9") {
    return "7 (9";
  }
  /* в других случаях просто 7 (  */
  return "7 (";
}; /* профикс в любом раскладе будет +7 () */

/* Ловим события ввода в любом поле */
document.addEventListener("input", (e) => {
  /* Проверяем, что это поле имеет класс phone-mask */
  if (e.target.classList.contains("phone-mask")) {
    /* поле с телефоном помещаем в переменную input */
    const input = e.target;
    /* вставляем плюс в начале номера */
    const value = input.value.replace(/\D+/g, "");
    /* длинна номера 11 символов */
    const numberLength = 11;

    /* Создаем переменную, куда будем записывать номер */
    let result;
    /* Если пользователь ввел 8... */
    if (input.value.includes("+8") || input.value[0] === "8") {
      /* Стираем восьмерку */
      result = "";
    } else {
      /* Оставляем плюсик в поле */
      result = "+";
    }

    /* Запускаем цикл, где переберем каждую цифру от 0 до 11 */
    for (let i = 0; i < value.length && i < numberLength; i++) {
      switch (i) {
        case 0:
          /* в самом начале ставим префикс +7 ( */
          result += prefixNumber(value[i]);
          continue;
        case 4:
          /* добавляем после "+7 (" круглую скобку ")" */
          result += ") ";
          break;
        case 7:
          /* дефис после 7 символа */
          result += "-";
          break;
        case 9:
          /* еще дефис  */
          result += "-";
          break;
        default:
          break;
      }
      /* на каждом шаге цикла добавляем новую цифру к номеру */
      result += value[i];
    }
    /* итог: номер в формате +7 (999) 123-45-67 */
    input.value = result;
  }
});
