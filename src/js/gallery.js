import apiService from "./apiService";

import imgListItemTemplate from "../templates/img-list-item.hbs";

const basicLightbox = require("basiclightbox");
// import * as basicLightbox from "basiclightbox";

const debounce = require("lodash.debounce");

const refs = {
  searchForm: document.querySelector("#search-form"),
  imgList: document.querySelector("#gallery"),
  loadMoreBtn: document.querySelector("#js-load-more"),
  jsBtnUp: document.querySelector("#js-btn-up"),
};

function insertListItem(items) {
  const markup = imgListItemTemplate(items);
  refs.imgList.insertAdjacentHTML("beforeend", markup);
}

// SEARCH IMG

function searchImg(e) {
  e.preventDefault();

  const form = e.target;
  const inputValue = form.firstElementChild.value;

  apiService.resetPage();
  refs.imgList.innerHTML = "";
  refs.loadMoreBtn.classList.remove("show");

  apiService.serchQuery = inputValue;

  apiService
    .fetchImg()
    .then(insertListItem)
    .then(() => {
      if (refs.imgList.children.length) {
        refs.loadMoreBtn.classList.add("show");
      }
    });

  form.firstElementChild.value = "";
}

refs.searchForm.addEventListener("submit", searchImg);

// LOAD MORE

function loadMoreBtnHandler() {
  apiService
    .fetchImg()
    .then(insertListItem)
    .then(() => {
      const scrollToElem =
        (apiService.page - 1) * apiService.perPage - apiService.perPage;

      refs.imgList.children[scrollToElem].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
}

const debouncedLoadMore = debounce(loadMoreBtnHandler, 500);

refs.loadMoreBtn.addEventListener("click", debouncedLoadMore);

// BUTTON UP

function toTopOfPage() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

refs.jsBtnUp.addEventListener("click", toTopOfPage);

function showBtnUp() {
  refs.jsBtnUp.hidden =
    window.pageYOffset < document.documentElement.clientHeight;
}

window.addEventListener("scroll", showBtnUp);

// MODAL

function showModal(e) {
  const { target } = e;
  if (target.tagName === "IMG") {
    basicLightbox
      .create(
        `
    <img src="${target.dataset.largeImgSrc}" width="1280">
    `,
      )
      .show();
  }
}

refs.imgList.addEventListener("click", showModal);
