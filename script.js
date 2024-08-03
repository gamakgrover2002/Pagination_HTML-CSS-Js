document.addEventListener("DOMContentLoaded", async () => {
  let data = await productAPI.fetchPagedData();

  productAPI.offset += productAPI.limit;

  render.renderPagination(productAPI.totalPages);
  render.renderProducts(data);
  handleProduct.generateHeightArray();
});

let limitElement = document.querySelector(".options");
limitElement.addEventListener("change", handleProduct.handleOptionChange);
