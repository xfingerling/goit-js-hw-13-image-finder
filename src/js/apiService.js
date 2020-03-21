const baseUrl = "https://pixabay.com/api/";
const API_KEY = "?key=15581732-f0b235014b6a569c91699f2a7";

export default {
  _query: "",
  page: 1,
  perPage: 12,

  fetchImg() {
    const requestParams = `&q=${this._query}&page=${this.page}&per_page=${this.perPage}&image_type=all&orientation=horizontal`;

    return fetch(baseUrl + API_KEY + requestParams)
      .then((res) => res.json())
      .then((totalImg) => {
        this.incrementPage();

        return totalImg;
      });
  },

  incrementPage() {
    this.page += 1;
  },

  resetPage() {
    this.page = 1;
  },

  get serchQuery() {
    return this._query;
  },
  set serchQuery(str) {
    this._query = str;
  },
};
