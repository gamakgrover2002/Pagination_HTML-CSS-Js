document.addEventListener("DOMContentLoaded", async () => {
  let data = await productAPI.fetchPagedData();
  productAPI.offset += productAPI.limit;

  render.renderPagination(productAPI.totalPages);
  render.renderProducts(data);

  const elem = document.getElementById("products-container");
  handleProduct.heightArray = [0];
  for (let i = 1; i <= productAPI.totalPages; i++) {
    handleProduct.heightArray.push(elem.scrollHeight * i);
  }
  console.log(handleProduct.heightArray);
});

let limitElement = document.querySelector(".options");
limitElement.addEventListener("change", handleProduct.handleOptionChange);
