class ProductAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async apiGet(limit, offset) {
    try {
      const response = await fetch(
        `${this.baseURL}?limit=${limit}&skip=${offset}&select=title,price`
      );
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProduct(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }
}

const baseURL = "https://dummyjson.com/products";
const productAPI = new ProductAPI(baseURL);
let limit = 9;
let data = [];
let offset = 0;
let productDetails = {};

async function fetchData() {
  try {
    const result = await productAPI.apiGet(limit, offset);
    data = result.products;
    window.scrollTo(0, 0);
    renderProducts();
  } catch (error) {
    console.error(error);
  }
}

async function getProduct(id) {
  try {
    const result = await productAPI.getProduct(id);
    productDetails[id] = result;
    renderProductDetails(id);
  } catch (error) {
    console.error(error);
  }
}

function renderProducts() {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";
  data.forEach((e) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product-div";
    productDiv.innerHTML = `
    ${e.title}<br />
    Price: $${e.price}<br />
    <button onclick="getProduct(${e.id})">Get Details</button>
    <div id="details-${e.id}"></div>
  `;
    productsContainer.appendChild(productDiv);
  });
}

function renderProductDetails(id) {
  const detailsDiv = document.getElementById(`details-${id}`);
  if (detailsDiv) {
    detailsDiv.innerHTML = `
    <p class="details">${productDetails[id].description}</p>
    <p class="rating">${productDetails[id].rating}/5</p>
  `;
  }
}

function handleScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const currentHeight = document.documentElement.scrollTop + window.innerHeight;

  if (currentHeight - 10 > scrollHeight) {
    offset += 9;
    fetchData();
  }
}

function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = `
  <button class="side-button" onclick="handlePageChange(${currentPage - 1})" ${
    currentPage === 1 ? "disabled" : ""
  }>Previous</button>
`;

  for (let num = 1; num <= totalPages; num++) {
    pagination.innerHTML += `
    <button class="${
      num === currentPage ? "active" : "button"
    }" onclick="handlePageChange(${num})">${num}</button>
  `;
  }

  pagination.innerHTML += `
  <button class="side-button" onclick="handlePageChange(${currentPage + 1})" ${
    currentPage === totalPages ? "disabled" : ""
  }>Next</button>
`;
}

function handlePageChange(pageNum) {
  const totalPages = 22;
  if (pageNum >= 1 && pageNum <= totalPages) {
    offset = (pageNum - 1) * 9;
    fetchData();
    renderPagination(pageNum, totalPages);
  }
}

window.addEventListener("scroll", handleScroll);

document.addEventListener("DOMContentLoaded", () => {
  fetchData();

  renderPagination(1, 22);
});
