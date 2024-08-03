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
    let numberListElem = document.getElementsByClassName("number-list")[0];
    let scrollPosition =
      (numberListElem.scrollWidth / productAPI.totalPages) *
      productAPI.currentPage;

    numberListElem.scrollTo({
      left: scrollPosition - 100,
    });
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
    let numberListElem = document.getElementsByClassName("number-list")[0];
    let scrollPosition =
      (numberListElem.scrollWidth / productAPI.totalPages) *
      productAPI.currentPage;

    numberListElem.scrollTo({
      left: scrollPosition - 100,
    });
  }

  updateCurrentPageBasedOnScroll(scrollTop) {
    for (let i = 1; i < this.heightArray.length; i++) {
      if (
        scrollTop >= this.heightArray[i - 1] &&
        scrollTop < this.heightArray[i]
      ) {
        if (productAPI.currentPage !== i) {
          productAPI.currentPage = i;
        }
        break;
      }
    }
  }
  async handlePageChange(pageNum) {
    if (
      pageNum < 1 ||
      pageNum > productAPI.totalPages ||
      pageNum === productAPI.currentPage
    ) {
      return;
    }

    if (this.isFetching) return;

    this.isFetching = true;
    const previousScrollTop = this.elem.scrollTop;
    this.elem = document.getElementById("products-container");
    let numberListElem = document.getElementsByClassName("number-list")[0];

    try {
      if (pageNum < productAPI.maxLoaded) {
        this.scrollToMiddleOfPage(pageNum);
        productAPI.currentPage = pageNum;
        render.renderPagination(productAPI.totalPages);

        return;
      } else {
        productAPI.offset = (pageNum - 1) * productAPI.limit;

        const data = await productAPI.fetchPagedData();

        if (data.length > 0) {
          await render.renderProducts(data);

          const newHeight = this.elem.scrollHeight;
          if (!this.heightArray.includes(newHeight)) {
            this.heightArray.push(newHeight);
          }

          this.scrollToMiddleOfPage(pageNum);
        }
      }
    } catch (error) {
      console.error("Error handling page change:", error);
    } finally {
      this.isFetching = false;
    }
    productAPI.currentPage = pageNum;
    render.renderPagination(productAPI.totalPages);
    let scrollPosition =
      (numberListElem.scrollWidth / productAPI.totalPages) *
      productAPI.currentPage;

    numberListElem.scrollTo({
      left: Math.max(scrollPosition - 100, 0), // Ensure position is within bounds
    });
  }

  scrollToMiddleOfPage(pageNum) {
    const pageHeight =
      this.heightArray[pageNum] - this.heightArray[pageNum - 1];
    const middleOfPage =
      (this.heightArray[pageNum + 1] + this.heightArray[pageNum]) / 2;
    this.elem.scrollTop = middleOfPage;
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
  generateHeightArray() {
    const elem = document.getElementsByClassName("product-div")[0];

    this.heightArray = [0];
    for (let i = 1; i <= productAPI.totalPages; i++) {
      this.heightArray.push(4.5 * elem.scrollHeight * i);
    }
  }
}

const handleProduct = new ProductHandle();
handleProduct.attachEventListeners();
