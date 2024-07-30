class ProductHandle {
  constructor() {
    this.heightArray = [];
    this.element;
  }

  async handleScroll() {
    let elem = document.getElementById("products-container");

    if (!elem) {
      console.error("Element with id 'products-container' not found.");
      return;
    }

    let scrollTop = elem.scrollTop;
    let clientHeight = elem.clientHeight;
    let scrollHeight = elem.scrollHeight;

    // Fetch new data when scrolled close to the bottom
    if (scrollTop + clientHeight >= scrollHeight - 3) {
      try {
        productAPI.currentPage += 1;
        render.renderPagination(productAPI.totalPages);

        // Fetch data and render products
        let data = await productAPI.fetchpagedata();
        productAPI.offset += productAPI.limit;
        await render.renderProducts(data);

        // Store current scroll position
        this.heightArray.push(scrollTop);
      } catch (error) {
        console.error("Error fetching paged data on scroll:", error);
      }
    }

    // Adjust pagination based on scroll position
    for (let i = this.heightArray.length - 1; i >= 0; i--) {
      if (scrollTop < this.heightArray[i]) {
        productAPI.currentPage = i + 1;
        render.renderPagination(productAPI.totalPages);
        break; // Exit loop once correct page is found
      }
    }
  }

  async handlePageChange(pageNum) {
    try {
      if (pageNum >= 1 && pageNum <= productAPI.totalPages) {
        productAPI.currentPage = pageNum;
        productAPI.offset = (pageNum - 1) * productAPI.limit;

        let data = await productAPI.fetchpagedata(
          productAPI.limit,
          productAPI.offset
        );
        await render.renderProducts(data);
        render.renderPagination(productAPI.totalPages);

        setTimeout(() => {
          var productContainer = document.getElementById("products-container");
          var pageHeight =
            productContainer.scrollHeight / productAPI.totalPages;
          var scrollPosition = (pageNum - 1) * pageHeight;

          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        }, 100); // Adjust timeout if necessary
      }
    } catch (error) {
      console.error("Error fetching paged data on page change:", error);
    }
  }

  async handleOptionChange() {
    try {
      this.heightArray = [];
      productAPI.limit = parseInt(document.querySelector(".options").value, 10);
      productAPI.currentPage = 1;
      productAPI.offset = 0;
      productAPI.completeData = [];
      let data = await productAPI.fetchpagedata(
        productAPI.limit,
        productAPI.offset
      );
      render.renderProducts(data);
      render.renderPagination(productAPI.totalPages);
    } catch (error) {
      console.error("Error fetching paged data on option change:", error);
    }
    window.scrollTo(0);
  }

  attachEventListeners() {
    document
      .getElementById("products-container")
      .addEventListener("scroll", this.handleScroll.bind(this));
    document
      .querySelector(".options")
      .addEventListener("change", this.handleOptionChange.bind(this));
  }
}

const handleProduct = new ProductHandle();
handleProduct.attachEventListeners();
