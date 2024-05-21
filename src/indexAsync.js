"use strict";
import "./css/styles.css";
import Notiflix from "notiflix";
import { getImages } from "./js/get-images.js";
import imageCard from "./templates/photo-card.hbs";
import { refs } from "./js/refs.js";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

function renderImageCard(imagesArr) {
  const markup = imagesArr.map((image) => imageCard(image)).join("");
  refs.gallery.insertAdjacentHTML("beforeend", markup);
}

let lightbox = new SimpleLightbox(".gallery a", {
  captions: true,
  captionsData: "alt",
  captionDelay: 250,
});

let pageNumber = 1;
let currentHits = 0;
let searchQuery = "";

async function onSearch(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.searchQuery.value;

  pageNumber = 1;

  if (searchQuery === "") {
    return Notiflix.Notify.failure("Please enter a search query!");
  }

  const imagesResponse = await getImages(searchQuery, pageNumber);

  currentHits = imagesResponse.data.hits.length;
  console.log("currentHits: ", currentHits);

  const totalHits = imagesResponse.data.totalHits;
  console.log("totalHits: ", totalHits);

  const imagesArr = imagesResponse.data.hits;
  console.log("imagesArr: ", imagesArr);

  addMoreButton(totalHits);

  try {
    successSearch(totalHits);

    checkNoMatches();

    refs.gallery.innerHTML = "";

    renderImageCard(imagesArr);

    lightbox.refresh();

    refs.loadMoreBtn.addEventListener("click", addMoreImagesOnClick);

    checkForLastPage(totalHits);
  } catch (error) {
    console.log(error);
  }
}

function successSearch(totalHits) {
  if (totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}

function checkNoMatches() {
  if (currentHits === 0) {
    return Notiflix.Notify.failure(
      "Sorry, there are no images matching your search query. Please try again."
    );
  }
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

async function addMoreImagesOnClick() {
  pageNumber += 1;

  const imagesResponse = await getImages(searchQuery, pageNumber);

  const imagesArr = imagesResponse.data.hits;
  console.log("currentHits after LoadMore: ", currentHits * pageNumber);

  const totalHits = imagesResponse.data.totalHits;
  console.log("totalHits after LoadMore: ", totalHits);

  try {
    checkNoMatches(currentHits);

    renderImageCard(imagesArr);

    lightbox.refresh();

    checkForLastPage(totalHits);

    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2.5,
      behavior: "smooth",
    });
  } catch (error) {
    console.log(error);
  }
}

refs.searchForm.addEventListener("submit", onSearch);
