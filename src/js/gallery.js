import apiService from "./apiService";

import imgListItemTemplate from "../templates/img-list-item.hbs";

const debounce = require("lodash.debounce");

const refs = {
  searchForm: document.querySelector("#search-form"),
  imgList: document.querySelector("#gallery"),
  jsLoadMore: document.querySelector("#js-load-more"),
};

function insertListItem(items) {
  const markup = imgListItemTemplate(items);
  refs.imgList.insertAdjacentHTML("beforeend", markup);
}

function searchImg(e) {
  const input = e.target;
  const inputValue = input.value;

  apiService.resetPage();
  refs.imgList.innerHTML = "";

  apiService.serchQuery = inputValue;

  apiService.fetchImg().then(insertListItem);

  input.value = "";
}

function loadMoreBtnHandler() {
  apiService.fetchImg().then(insertListItem);
}

const debouncedSearchImg = debounce(searchImg, 700);

refs.searchForm.addEventListener("input", debouncedSearchImg);
refs.jsLoadMore.addEventListener("click", loadMoreBtnHandler);
