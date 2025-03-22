// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы

// @todo: Функция создания карточки
function cardCreation(elements) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const placesList = document.querySelector('.places__list');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardElement.querySelector('.card__title').textContent = elements.name;
  cardElement.querySelector('.card__image').src = elements.link;

  deleteButton.addEventListener('click', deleteCard);

  placesList.append(cardElement);
};

// @todo: Функция удаления карточки
function deleteCard(evt) {
  const card = evt.target.closest('.card');
  if (card) {
    card.remove();
  };
};

// @todo: Вывести карточки на страницу
initialCards.forEach(function (item) {
  cardCreation(item);
});
