"use strict";

import "./css/styles.css";
import Notiflix from "notiflix";
import { getImages } from "./js/get-images.js";
import imageCard from "./templates/photo-card.hbs";
import { refs } from "./js/refs.js";

function renderImageCard(imagesArr) {
  const markup = imagesArr.map((image) => imageCard(image)).join("");
  refs.gallery.insertAdjacentHTML("beforeend", markup);
}

let pageNumber = 1;
let currentHits = 0;
let searchQuery = "";

function onSearch(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.searchQuery.value;

  pageNumber = 1;

  if (searchQuery === "") {
    return Notiflix.Notify.failure("Please enter a search query!");
  }

  const imagesResponse = getImages(searchQuery, pageNumber);

  imagesResponse
    .then((images) => {
      const imagesArr = images.data.hits;
      console.log("imagesArr: ", imagesArr);

      currentHits = images.data.hits.length;
      console.log("currentHits: ", currentHits);

      const totalHits = images.data.totalHits;
      console.log("totalHits: ", totalHits);

      successSearch(totalHits);

      if (currentHits === 0) {
        return alertNoMatches();
      }

      refs.gallery.innerHTML = "";

      renderImageCard(imagesArr);

      addMoreButton(totalHits);

      refs.loadMoreBtn.addEventListener("click", addMoreImagesOnClick);

      checkForLastPage(totalHits);
    })
    .catch(console.warn);
}

function successSearch(totalHits) {
  if (totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}

function alertNoMatches() {
  Notiflix.Notify.failure(
    "Sorry, there are no images matching your search query. Please try again."
  );
}

function warningNoMatches() {
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
}

function addMoreButton(totalHits) {
  if (totalHits < 40) {
    return;
  }
  refs.loadMoreBtn.classList.add("is-open");
}

function checkForLastPage(totalHits) {
  if (totalHits <= pageNumber * 40) {
    refs.loadMoreBtn.classList.remove("is-open");
    warningNoMatches();
  }
}

function addMoreImagesOnClick() {
  pageNumber += 1;

  const imagesResponse = getImages(searchQuery, pageNumber);

  imagesResponse
    .then((images) => {
      const imagesArr = images.data.hits;
      console.log("currentHits after LoadMore: ", currentHits * pageNumber);

      const totalHits = images.data.totalHits;
      console.log("totalHits after LoadMore: ", totalHits);

      if (currentHits === 0) {
        alertNoMatches();
        return;
      }

      renderImageCard(imagesArr);

      checkForLastPage(totalHits);

      const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2.5,
        behavior: "smooth",
      });
    })
    .catch(console.warn);
}

refs.searchForm.addEventListener("submit", onSearch);
