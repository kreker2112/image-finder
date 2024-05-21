"use strict";

import axios from "axios";

axios.defaults.baseURL = "https://pixabay.com/api/";

export async function getImages(searchInput, page) {
  const key = "39315149-fad4768c6404d095435b55e12";
  const imageType = `photo`;
  const orientation = `horizontal`;
  const perPage = "40";
  return await axios.get(
    `?key=${key}&q=${searchInput}&image_type=${imageType}&orientation=${orientation}&page=${page}&per_page=${perPage}`
  );
}
