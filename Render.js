class Render {
  constructor() {}

  clearElement(element) {
    element.innerHTML = "";
  }

  renderElements(element, subElements, elementType) {
    this.clearElement(element);
    subElements.forEach((e) => {
      const node = document.createElement(elementType);
      node.innerText = e;
      element.appendChild(node);
    });
  }

  async renderProducts(data) {
    const productsContainer = document.getElementById("products-container");
    this.clearElement(productsContainer);

    const fragment = document.createDocumentFragment();

    data.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product-div";
      productDiv.innerHTML = `
        <div class="product-title">${product.title}</div>
        <div class="product-price">Price: $${product.price}</div>
        <div id="details-${product.id}" class="details"></div>
      `;
      fragment.appendChild(productDiv);
    });

    productsContainer.appendChild(fragment);
  }

  renderPagination(totalPages) {
    const pagination = document.getElementById("pagination");
    this.clearElement(pagination);
    pagination.classList.add("scrollable-pagination");
    const createButton = (
      label,
      onClick,
      disabled = false,
      className = "button"
    ) => {
      const button = document.createElement("button");
      button.innerText = label.toString();
      button.className = className;
      button.disabled = disabled;
      button.addEventListener("click", onClick);
      return button;
    };

    const handlePageChangeWithScroll = (pageNum) => {
      handleProduct.handlePageChange(pageNum);
    };

    pagination.appendChild(
      createButton(
        "Prev",
        () => handlePageChangeWithScroll(productAPI.currentPage - 1),
        productAPI.currentPage === 1,
        "side-button"
      )
    );

    const pageNumbers = document.createElement("div");
    pageNumbers.classList.add("number-list");

    for (let num = 1; num <= totalPages; num++) {
      pageNumbers.appendChild(
        createButton(
          num.toString(),
          () => handlePageChangeWithScroll(num),
          false,
          num === productAPI.currentPage ? "active" : "button"
        )
      );
    }
    pagination.appendChild(pageNumbers);

    pagination.appendChild(
      createButton(
        "Next",
        () => handlePageChangeWithScroll(productAPI.currentPage + 1),
        productAPI.currentPage === totalPages,
        "side-button"
      )
    );
  }
}
const render = new Render();
