import * as basicLightbox from "basiclightbox";
import PNotify from "../../node_modules/pnotify/dist/es/PNotify";

import apiService from "./apiService";

import imgListItemTemplate from "../templates/img-list-item.hbs";

const debounce = require("lodash.debounce");

const refs = {
  searchForm: document.querySelector("#search-form"),
  searchBtn: document.querySelector(".search-form__bnt"),
  imgList: document.querySelector("#gallery"),
  loadMoreBtn: document.querySelector("#js-load-more"),
  jsBtnUp: document.querySelector("#js-btn-up"),
};

function insertListItem(items) {
  const markup = imgListItemTemplate(items.hits);
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
  PNotify.closeAll();

  apiService.serchQuery = inputValue;

  // if (apiService.serchQuery === "") {
  //   return;
  // }

  apiService
    .fetchImg()
    .then((totalImg) => {
      insertListItem(totalImg);

      if (!totalImg.hits.length) {
        PNotify.info({
          text: "Your search did not match any results. Please try again",
          delay: 3000,
        });
      }

      PNotify.info({
        text: `Your search returned ${totalImg.total} images`,
        delay: 3000,
      });
    })
    .then(() => {
      if (refs.imgList.children.length) {
        refs.searchBtn.removeAttribute("disabled");
        refs.loadMoreBtn.classList.add("show");
      }
    });

  refs.searchBtn.setAttribute("disabled", "disabled");

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
      refs.loadMoreBtn.removeAttribute("disabled");
    });

  refs.loadMoreBtn.setAttribute("disabled", "disabled");
}

// const debouncedLoadMore = debounce(loadMoreBtnHandler, 500);

refs.loadMoreBtn.addEventListener("click", loadMoreBtnHandler);

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

  const instance = basicLightbox.create(
    `
<img src=${target.dataset.largeImgSrc}" width="1280">
`,
    // { closable: false },
  );

  if (target.tagName === "IMG") {
    instance.show();
  }
}

document.body.addEventListener("click", showModal);
