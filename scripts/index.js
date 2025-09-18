const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },

  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  disableButton(newPostSubmitBtn, settings);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileModal.addEventListener("click", (event) => {
  if (event.target === editProfileModal) {
    editProfileModal.classList.remove("modal_is-opened");
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    editProfileModal.classList.contains("modal_is-opened")
  ) {
    editProfileModal.classList.remove("modal_is-opened");
  }
});

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});
editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

const newPostBtn = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostSubmitBtn = newPostModal.querySelector(".modal__save-btn");
const newPostEl = document.querySelector("#new-post-modal");
const newPostCaptionInput = newPostEl.querySelector("#card-caption-input");
const newPostLinkInput = newPostEl.querySelector("#card-image-input");

const cardsList = document.querySelector(".cards__list");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-button_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
    openModal(previewModal);
  });
  previewModal.addEventListener("click", (event) => {
    if (event.target === previewModal) {
      previewModal.classList.remove("modal_is-opened");
    }
  });

  return cardElement;
}

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalImageEl = previewModal.querySelector(".modal__image");

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    previewModal.classList.contains("modal_is-opened")
  ) {
    previewModal.classList.remove("modal_is-opened");
  }
});

newPostBtn.addEventListener("click", function () {
  resetValidation(modalForm, [newPostCaptionInput, newPostLinkInput], settings);
  openModal(newPostModal);
});
newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

newPostModal.addEventListener("click", (event) => {
  if (event.target === newPostModal) {
    newPostModal.classList.remove("modal_is-opened");
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    newPostModal.classList.contains("modal_is-opened")
  ) {
    newPostModal.classList.remove("modal_is-opened");
  }
});

const modalForm = newPostModal.querySelector(".modal__form");

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: newPostCaptionInput.value,
    link: newPostLinkInput.value,
  };

  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  evt.target.reset();
  disableButton(newPostSubmitBtn, settings);
  closeModal(newPostModal);
}
newPostEl.addEventListener("submit", handleNewPostSubmit);

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  editProfileModal.classList.remove("modal_is-opened");
}
editProfileForm.addEventListener("submit", handleEditProfileSubmit);

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

disableButton(newPostSubmitBtn, settings);
