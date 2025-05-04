import '../pages/index.css';
// Импортируем модули
import { createCard, handleLikeButton } from './components/card.js'; //удалил deleteCard
import { openModal, closeModal, setPopupListeners } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { 
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  deleteUserCard,
  updateUserAvatar 
  } from './components/api.js';

// DOM Основной контент
const placesList = document.querySelector('.places__list');
const openEditBtn = document.querySelector('.profile__edit-button');
const openAddCardBtn = document.querySelector('.profile__add-button');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const avatarPreview = document.querySelector('.profile__image');
const avatarEditButton = document.querySelector('.profile__avatar-edit-button');

// DOM Попап
const editAvatarPopup = document.querySelector('.popup_type_edit_avatar');
const editPopuo = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const deletCardPopup = document.querySelector('.popup_type_delete-card');
const popupImg = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

//DOM Формы
const editProfileForm = document.forms['edit-profile'];
const newPlaceForm = document.forms['new-place'];
const editAvatarForm = document.forms['user-avatar'];
const deletCardForm = document.forms['delete-card'];

//DOM Инпуты форм
const nameInput = editProfileForm.querySelector('.popup__input_type_name');
const jobInput = editProfileForm.querySelector('.popup__input_type_description');
const placeNameInput = newPlaceForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = newPlaceForm.querySelector('.popup__input_type_url');
const avatarInput = editAvatarForm.querySelector('.popup__input_avatar_type_url');

//config для волидации форм
const validationConfig = {
  formSelector: '.popup__form',                 
  inputSelector: '.popup__input',               
  submitButtonSelector: '.popup__button',       
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',   
  errorClass: 'popup__error_visible'            
};

//глобальные переменные
// ID карточки которую пользователь выбрал для удаления
let cardIdToDelete = null;
// ID карточки карточку которую нужно удалить после true
let cardElementToDelete = null;
// ID текущего пользователя
let currentUserId;
// URL текущего аватара пользователя
let currentAvatarUrl = '';

//
function renderLoading(isLoading, popupElement, loadingText = 'Сохранение...') {
  const button = popupElement.querySelector('.popup__button');
  if (!button) return;

  // Сохраняем исходный текст только один раз
  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }

  button.textContent = isLoading ? loadingText : button.dataset.originalText;
};

// обработчик открытия картинки в попапе
function handleCardClick(name, link) {
  popupImg.src = link;
  popupImg.alt = name;
  popupCaption.textContent = name;
  openModal(popupImage);
};

// обработчики открытия попапоа редактирования avatar
avatarEditButton.addEventListener('click', () => {
  avatarInput.value = currentAvatarUrl;
  clearValidation(editAvatarForm, validationConfig);
  openModal(editAvatarPopup);
});

// открытие попапа редактирования профиля
openEditBtn.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editProfileForm, validationConfig); // очищаем ошибки и блокируем кнопку
  openModal(editPopuo);
});

// открытие попапа добавления карточки
openAddCardBtn.addEventListener('click', () => {
  newPlaceForm.reset();
  clearValidation(newPlaceForm, validationConfig); // очищаем ошибки и блокируем кнопку
  openModal(newCardPopup);
});

//открытия попапа удаления
function handleDeleteCard(cardId, cardElement) {
  cardIdToDelete = cardId;
  cardElementToDelete = cardElement;
  openModal(deletCardPopup);
}

// назначаем обработчики закрытия (крестик и оверлей)
const popups = document.querySelectorAll('.popup');
popups.forEach(setPopupListeners);

// обработчик редактирования профиля
function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  renderLoading(true, editPopuo);

  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

//обявляем функция редоктирования профиля 
  updateUserInfo(nameValue, jobValue)
  .then((userData) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    closeModal(editPopuo);
  })
  .catch((err) => {
    console.log('Ошибка при обновлении профиля:', err);
  })
  .finally(() => {
    renderLoading(false, editPopuo);
  });
};
// назначаем обработчик
editProfileForm.addEventListener('submit', handleEditProfileSubmit);

// обработчик добавления карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, newCardPopup);

  const cardName = placeNameInput.value;
  const cardLink = placeLinkInput.value;

  addNewCard(cardName, cardLink)
  .then((cardData) => {
    const card = createCard(
      cardData,
      handleCardClick,
      handleLikeButton,
      handleDeleteCard,
      currentUserId
    );
    placesList.prepend(card);
    newPlaceForm.reset();
    closeModal(newCardPopup);
  })
  .catch((err) => {
    console.log('Ошибка при добавлении карточки:', err);
  })
  .finally(() => {
    renderLoading(false, newCardPopup);
  });
};
// назначаем обработчик
newPlaceForm.addEventListener('submit', handleAddCardSubmit);

//оброботчик avatar
function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, editAvatarPopup);

  const avatarLink = avatarInput.value;
  updateUserAvatar(avatarLink)
  .then((userData) => {
    avatarPreview.style.backgroundImage = `url(${userData.avatar})`;
    currentAvatarUrl = userData.avatar;
    closeModal(editAvatarPopup);
    editAvatarForm.reset();
  })
  .catch((err) => {
    console.log('Ошибка при обновлении аватара:', err);
  })
  .finally(() => {
    renderLoading(false, editAvatarPopup);
  });
};
editAvatarForm.addEventListener('submit', handleEditAvatarSubmit);


// обработчик удоления карточки
deletCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  renderLoading(true, deletCardPopup, 'Удаление...');

  deleteUserCard(cardIdToDelete)
  .then(() => {
    cardElementToDelete.remove();
    closeModal(deletCardPopup);
    cardIdToDelete = null;
    cardElementToDelete = null;
  })
  .catch((err) => {
    console.log('Ошибка при удалении карточки:', err);
  })
  .finally(() => {
    renderLoading(false, deletCardPopup);
  });
});

// загружаем данные пользователя и карточки с сервера
Promise.all([getUserInfo(), getInitialCards()])
.then(([userData, cards]) => {
   // сохраняем id текущего пользователя
  currentUserId = userData._id;
  // отображаем профиль
  profileName.textContent = userData.name;
  profileDescription.textContent = userData.about;
  currentAvatarUrl = userData.avatar;
  avatarPreview.style.backgroundImage = `url(${userData.avatar})`;

  // отображаем карточек других пользователей
  cards.reverse().forEach((item) => {
    const cardElement = createCard(
      item,
      handleCardClick,
      handleLikeButton,
      handleDeleteCard,
      currentUserId
    );
    placesList.append(cardElement);
  });
})
.catch((err) => {
  console.log('Ошибка при загрузке данных карточек пользователей:', err);
});

enableValidation(validationConfig);
