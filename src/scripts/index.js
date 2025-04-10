import '../pages/index.css'; 
// Импортируем модули
import { initialCards, cardCreation } from './components/cards.js';
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

// Обработчик открытия картинки в попапе
function handleCardClick(name, link) {
  popupImg.src = link;
  popupImg.alt = name;
  popupCaption.textContent = name;
  openModal(popupImage);
};

// Обработчик лайка
function handleLikeButton(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
};

// Обработчики открытия попапов
openEditBtn.addEventListener('click', () => openModal(editPopuo));
openAddCardBtn.addEventListener('click', () => openModal(newCardPopup));

// Назначаем обработчики закрытия (крестик и оверлей)
const popups = document.querySelectorAll('.popup');
popups.forEach(setPopupListeners);

// Обработчики отправки форм
editProfileForm.addEventListener('submit', function(evt) {
  handleFormSubmit(evt, 'profile')} );
newPlaceForm.addEventListener('submit', function(evt) {
  handleFormSubmit(evt, 'new-card', placesList, handleCardClick, handleLikeButton)
});

// Инициализация карточек
initialCards.forEach(item => {
  placesList.append(cardCreation(item, handleCardClick, handleLikeButton));
});

// обработчик форм
function handleFormSubmit(evt, type, placesList, handleCardClick, handleLikeButton) {
  evt.preventDefault();

  if (type === 'profile') {
    const nameInput = evt.target.querySelector('.popup__input_type_name');
    const jobInput = evt.target.querySelector('.popup__input_type_description');

    profileName.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;

    const popup = evt.target.closest('.popup');
    closeModal(popup);
  };

  if (type === 'new-card') {
    const placeNameInput = evt.target.querySelector('.popup__input_type_card-name');
    const placeLinkInput = evt.target.querySelector('.popup__input_type_url');

    const newCard = {
      name: placeNameInput.value,
      link: placeLinkInput.value
    };

    const card = cardCreation(newCard, handleCardClick, handleLikeButton);
    placesList.prepend(card);

    evt.target.reset();
    const popup = evt.target.closest('.popup');
    closeModal(popup);
  };
};