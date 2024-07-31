class ProductHandle {
  constructor() {
    this.heightArray = [];
    this.scrollTop = 0;
    this.elem = document.getElementById("products-container");
    this.pagepositions = { 1: 0 };
  }
  handleScrollPage(page) {
    console.log(this.pagepositions);
    if (page in this.pagepositions) {
      this.elem.scrollTo({
        top: this.pagepositions[page],
        behavior: "smooth",
      });
    } else {
      this.elem.scrollTop = 0;
    }
  }
  async handleScroll() {
    let scrollTop = this.elem.scrollTop;
    let clientHeight = this.elem.clientHeight;
    let scrollHeight = this.elem.scrollHeight;

    if (productAPI.currentPage > productAPI.totalPages) {
      productAPI.currentPage = productAPI.totalPages;
      render.renderPagination(productAPI.totalPages);
    }
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      try {
        productAPI.currentPage = productAPI.prevPage + 1;
        let data = await productAPI.fetchpagedata();
        productAPI.offset += productAPI.limit;
        await render.renderProducts(data);
        render.renderPagination(productAPI.totalPages);
        this.scrollTop = scrollTop;
        this.pagepositions[productAPI.currentPage] = scrollTop;
        this.heightArray.push(scrollTop);
      } catch (error) {
        console.error("Error fetching paged data on scroll:", error);
      }
    }

    for (let i = this.heightArray.length - 1; i >= 0; i--) {
      if (scrollTop < this.heightArray[i]) {
        productAPI.currentPage = i + 1;
        render.renderPagination(productAPI.totalPages);
        break;
      }
    }
  }

  async handlePageChange(pageNum) {
    try {
      if (pageNum >= 1 && pageNum <= productAPI.totalPages) {
        productAPI.currentPage = pageNum;
        render.renderPagination(productAPI.totalPages);
        productAPI.offset = (pageNum - 1) * productAPI.limit;

        let data = await productAPI.fetchpagedata(
          productAPI.limit,
          productAPI.offset
        );

        await render.renderProducts(data);
        this.handleScrollPage(pageNum);
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
      await render.renderProducts(data);
      render.renderPagination(productAPI.totalPages);
    } catch (error) {
      console.error("Error fetching paged data on option change:", error);
    }
  }

  attachEventListeners() {
    this.elem.addEventListener("scroll", this.handleScroll.bind(this));
    document
      .querySelector(".options")
      .addEventListener("change", this.handleOptionChange.bind(this));
  }
}

const handleProduct = new ProductHandle();
handleProduct.attachEventListeners();
