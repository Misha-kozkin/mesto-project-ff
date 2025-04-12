import '../pages/index.css'; 
// Импортируем модули
import { initialCards } from './components/cards.js';
import { createCard, handleLikeButton, deleteCard } from './components/card.js';
import { openModal, closeModal, setPopupListeners } from './components/modal.js';

// DOM-элементы страницы
const placesList = document.querySelector('.places__list');
const newCardPopup = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupImg = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');
const openEditBtn = document.querySelector('.profile__edit-button');
const openAddCardBtn = document.querySelector('.profile__add-button');
const editPopuo = document.querySelector('.popup_type_edit');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const editProfileForm = document.forms['edit-profile'];
const newPlaceForm = document.forms['new-place'];
// Глобальные инпуты
const nameInput = editProfileForm.querySelector('.popup__input_type_name');
const jobInput = editProfileForm.querySelector('.popup__input_type_description');
const placeNameInput = newPlaceForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = newPlaceForm.querySelector('.popup__input_type_url');

// Обработчик открытия картинки в попапе
function handleCardClick(name, link) {
  popupImg.src = link;
  popupImg.alt = name;
  popupCaption.textContent = name;
  openModal(popupImage);
}

// Обработчики открытия попапов
openEditBtn.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editPopuo);
});

openAddCardBtn.addEventListener('click', () => openModal(newCardPopup));

// Назначаем обработчики закрытия (крестик и оверлей)
const popups = document.querySelectorAll('.popup');
popups.forEach(setPopupListeners);

// обработчик редактирования профиля
function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  profileName.textContent = nameValue;
  profileDescription.textContent = jobValue;

  closeModal(editPopuo);
};
// Назначаем обработчик
editProfileForm.addEventListener('submit', handleEditProfileSubmit);


// обработчик добавления карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const cardName = placeNameInput.value;
  const cardLink = placeLinkInput.value;

  const newCard = {
    name: cardName,
    link: cardLink
  };

  const card = createCard(newCard, handleCardClick, handleLikeButton, deleteCard);
  placesList.prepend(card);

  newPlaceForm.reset();
  closeModal(newCardPopup);
};
// Назначаем обработчик
newPlaceForm.addEventListener('submit', handleAddCardSubmit);


// Инициализация карточек
initialCards.forEach(item => {
  placesList.append(createCard(item, handleCardClick, handleLikeButton, deleteCard));
});