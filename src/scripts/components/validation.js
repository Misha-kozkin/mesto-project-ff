export const validationConfig = {
  formSelector: '.popup__form',                 
  inputSelector: '.popup__input',               
  submitButtonSelector: '.popup__button',       
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',   
  errorClass: 'popup__error_visible'            
};

// Функция показывает ошибку под input.
function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

// Функция скрывает ошибку под input.
function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = '';
}

// Проверка валидности поля.
function checkInputValidity(formElement, inputElement, config) {
  if (!inputElement.validity.valid) {
    const customMessage = inputElement.dataset.errorMessage || inputElement.validationMessage;
    showInputError(formElement, inputElement, customMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// Проверка наличия невалидного полей.
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => !inputElement.validity.valid);
}

// Управление состоянием кнопки.
function toggleButtonState(inputList, buttonElement, config) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

// Установка слушателей на input's.
function setEventListeners(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

// Включение валидации для всех форм.
export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => evt.preventDefault());
    setEventListeners(formElement, config);
  });
};

// Очистка ошибок формы и деактивация кнопки
export function clearValidation(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
};