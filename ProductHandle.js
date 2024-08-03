class ProductHandle {
  constructor() {
    this.elem = document.getElementById("products-container");
    this.heightArray = [0];
    this.isFetching = false;
    this.handleScroll = this.handleScroll.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.scrollTimeout = null;
  }

  async handleScroll() {
    const scrollTop = this.elem.scrollTop;
    const clientHeight = this.elem.clientHeight;
    const scrollHeight = this.elem.scrollHeight;

    if (clientHeight + scrollTop >= scrollHeight - 1 && !this.isFetching) {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      this.scrollTimeout = setTimeout(() => {
        this.loadNextPageData();
      }, 300);
    } else {
      this.updateCurrentPageBasedOnScroll(scrollTop);
    }
  }

  async loadNextPageData() {
    if (this.isFetching) return;

    this.isFetching = true;
    const previousScrollTop = this.elem.scrollTop;

    try {
      const data = await productAPI.fetchPagedData();
      if (data.length > 0) {
        productAPI.offset += productAPI.limit;
        await render.renderProducts(data);
        render.renderPagination(productAPI.totalPages);

        const newHeight = this.elem.scrollHeight;
        if (!this.heightArray.includes(newHeight)) {
          this.heightArray.push(newHeight);
        }

        this.elem.scrollTop = previousScrollTop;
        this.updateCurrentPageBasedOnScroll(this.elem.scrollTop);
      }
    } catch (error) {
      console.error("Error loading next page data:", error);
    } finally {
      this.isFetching = false;
    }
  }

  updateCurrentPageBasedOnScroll(scrollTop) {
    for (let i = 1; i < this.heightArray.length; i++) {
      if (
        scrollTop >= this.heightArray[i - 1] &&
        scrollTop < this.heightArray[i]
      ) {
        if (productAPI.currentPage !== i) {
          productAPI.currentPage = i;
          render.renderPagination(productAPI.totalPages);
        }
        break;
      }
    }
  }

  async handlePageChange(pageNum) {
    if (pageNum < 1 || pageNum > productAPI.totalPages) return;

    if (pageNum === productAPI.currentPage) return;

    if (pageNum <= productAPI.maxLoaded) {
      productAPI.currentPage = pageNum;
      render.renderPagination(productAPI.totalPages);
      this.scrollToMiddleOfPage(pageNum);
    } else {
      if (this.isFetching) return;

      this.isFetching = true;
      const previousScrollTop = this.elem.scrollTop;

      try {
        const data = await productAPI.fetchPagedData();
        if (data.length > 0) {
          productAPI.offset += productAPI.limit;
          await render.renderProducts(data);
          productAPI.maxLoaded = pageNum;

          const newHeight = this.elem.scrollHeight;
          if (!this.heightArray.includes(newHeight)) {
            this.heightArray.push(newHeight);
          }
        }

        productAPI.currentPage = pageNum;
        render.renderPagination(productAPI.totalPages);
        this.scrollToMiddleOfPage(pageNum);
      } catch (error) {
        console.error("Error handling page change:", error);
      } finally {
        this.isFetching = false;
      }
    }
  }

  scrollToMiddleOfPage(pageNum) {
    const pageHeight =
      this.heightArray[pageNum] - this.heightArray[pageNum - 1];
    const middleOfPage =
      (this.heightArray[pageNum - 1] + this.heightArray[pageNum]) / 2;
    this.elem.scrollTop = middleOfPage - this.elem.clientHeight / 2;
  }

  async handleOptionChange() {
    const limit = parseInt(document.querySelector(".options").value, 10);
    productAPI.limit = limit;
    productAPI.totalPages = Math.ceil(productAPI.total / limit);
    this.heightArray = [0];
    productAPI.currentPage = 1;
    productAPI.offset = 0;

    try {
      const data = await productAPI.fetchPagedData();
      await render.renderProducts(data);
      render.renderPagination(productAPI.totalPages);

      const elem = this.elem;
      this.heightArray = [0];
      for (let i = 1; i <= productAPI.totalPages; i++) {
        this.heightArray.push(elem.scrollHeight * i);
      }
    } catch (error) {
      console.error("Error handling option change:", error);
    }
  }

  attachEventListeners() {
    this.elem.addEventListener("scroll", this.handleScroll);
    document
      .querySelector(".options")
      .addEventListener("change", this.handleOptionChange);
  }
}

const handleProduct = new ProductHandle();
handleProduct.attachEventListeners();
