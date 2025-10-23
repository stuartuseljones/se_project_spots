import enableValidation from "../scripts/validation.js";
import {
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "cf4b82b0-8c2a-4487-8e5d-92e0dda1e942",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    const name = document.querySelector(".profile__name");
    const about = document.querySelector(".profile__description");
    const avatar = document.querySelector(".profile__avatar");
    name.textContent = userInfo.name;
    about.textContent = userInfo.about;
    avatar.src = userInfo.avatar;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch((error) => {
    console.error("Error fetching cards:", error);
  });

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
let currentModal;

// Delete Card Modal
const deleteModal = document.querySelector("#delete-modal");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteForm = deleteModal.querySelector(".modal__form-delete");
let selectedCard;
let selectedCardId;

//Avatar form Element
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarNameEl = document.querySelector(".avatar__name");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .patchUserAvatar(avatarInput.value)
    .then((data) => {
      avatarInput.textcontent = data.avatar;
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
  avatarModal.classList.remove("modal_is-opened");
}

enableValidation(settings);

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  currentModal = modal;
  document.addEventListener("keydown", handleEscapeKey);
  if (modal === newPostModal) {
    disableButton(newPostSubmitBtn, settings);
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

editProfileModal.addEventListener("click", (event) => {
  if (event.target === editProfileModal) {
    editProfileModal.classList.remove("modal_is-opened");
  }
});

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    closeModal(currentModal);
  }
}

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

function handleLike(evt, id) {
  evt.preventDefault();
  const isLiked = evt.target.classList.contains("card__like-button_active");

  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_active");
    })
    .catch(console.error);
}

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
  cardLikeBtnEl.addEventListener("click", (evt) => handleLike(evt, data._id));
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-button_active");
  } else {
    cardLikeBtnEl.classList.remove("card__like-button_active");
  }
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
    openModal(previewModal);
    initializeApp();
  });

  return cardElement;
}
function initializeApp() {
  previewModal.addEventListener("click", (event) => {
    if (event.target === previewModal) {
      closeModal(previewModal);
    }
  });
}

// Delete Modal Functions
function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}
deleteCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});
deleteModal.addEventListener("click", (event) => {
  if (event.target === deleteModal) {
    deleteModal.classList.remove("modal_is-opened");
  }
});
deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalImageEl = previewModal.querySelector(".modal__image");
previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

//Avatar Listeners
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    avatarModal.classList.contains("modal_is-opened")
  ) {
    avatarModal.classList.remove("modal_is-opened");
  }
});
avatarModal.addEventListener("click", (event) => {
  if (event.target === avatarModal) {
    avatarModal.classList.remove("modal_is-opened");
  }
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

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
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .postCard({
      name: newPostCaptionInput.value,
      link: newPostLinkInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });

  evt.target.reset();
  disableButton(newPostSubmitBtn, settings);
  closeModal(newPostModal);
}
newPostEl.addEventListener("submit", handleNewPostSubmit);

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .patchUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });

  editProfileModal.classList.remove("modal_is-opened");
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const deleteBtn = evt.submitter;
  deleteBtn.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      deleteModal.classList.remove("modal_is-opened");
    })
    .catch(console.error)
    .finally(() => {
      deleteBtn.textContent = "Delete";
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
disableButton(newPostSubmitBtn, settings);
