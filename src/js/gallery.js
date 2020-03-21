import apiService from "./apiService";

import imgListItemTemplate from "../templates/img-list-item.hbs";

var debounce = require("lodash.debounce");

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

function searchImg(e) {
  e.preventDefault();

  const form = e.target;
  const inputValue = form.firstElementChild.value;

  apiService.resetPage();
  refs.imgList.innerHTML = "";

  apiService.serchQuery = inputValue;

  apiService
    .fetchImg()
    .then(insertListItem)
    .then(() => {
      refs.loadMoreBtn.classList.add("show");
    });

  form.firstElementChild.value = "";
}

refs.searchForm.addEventListener("submit", searchImg);

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

function toTopOfPage() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

refs.jsBtnUp.addEventListener("click", toTopOfPage);

function showBtnUp() {
  refs.jsBtnUp.hidden = pageYOffset < document.documentElement.clientHeight;
}

window.addEventListener("scroll", showBtnUp);
