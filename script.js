const navs = ["Home", "About", "Contact"];
const pages = [];

const navbar = document.getElementById("navs");
const prevButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const numButton = document.getElementById("number-buttons");

render.renderElements(navbar, navs, "li");

let numberButton = document.getElementById("number-buttons").childNodes;
numberButton.forEach((button) => {
  button.addEventListener("click", handleProduct.handlePageChange);
});

document.addEventListener("DOMContentLoaded", async () => {
  let data = await productAPI.fetchpagedata();
  productAPI.offset += productAPI.limit;
  console.log(productAPI.totalPages);
  render.renderPagination(productAPI.totalPages);

  render.renderProducts(data);
});

let limitElement = document.querySelector(".options");

limitElement.addEventListener("change", handleProduct.handleOptionChange);
