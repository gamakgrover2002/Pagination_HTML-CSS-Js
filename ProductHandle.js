class ProductHandle {
  constructor() {
    this.heightArray = [];
    this.scrollTop = 0;
    this.elem = document.getElementById("products-container");
    this.pagepositions = { 1: 0 };
  }

  async handleScroll() {
    let scrollTop = this.elem.scrollTop;
    let clientHeight = this.elem.clientHeight;
    let scrollHeight = this.elem.scrollHeight;

    if (productAPI.currentPage > productAPI.totalPages) {
      productAPI.currentPage = productAPI.totalPages;
      render.renderPagination(productAPI.totalPages);
    }
    if (clientHeight + scrollTop + 1 >= scrollHeight) {
      setTimeout(async () => {
        try {
          productAPI.currentPage = Math.ceil(
            scrollHeight / (clientHeight + 200)
          );
          let data = await productAPI.fetchpagedata(
            productAPI.limit,
            productAPI.offset
          );

          productAPI.offset += productAPI.limit;
          await render.renderProducts(data);
          render.renderPagination(productAPI.totalPages);
          let paginationDivs = document.getElementsByClassName("button");
          let containerDivs = document.getElementsByClassName("number-list");
          let scrollWidth = paginationDivs[1].clientWidth;

          if (paginationDivs.length > 1 && containerDivs.length > 0) {
            console.log(2 * scrollWidth);
            containerDivs[0].scrollTo({
              left: 1.5 * scrollWidth * productAPI.currentPage,
              behavior: "smooth",
            });
          }

          this.scrollTop = scrollTop;
          this.pagepositions[productAPI.currentPage] = scrollTop;
          this.heightArray[productAPI.currentPage] = Math.ceil(
            scrollHeight / (clientHeight + 200)
          );
        } catch (error) {
          console.error("Error updating pagination and scroll:", error);
        }
      }, 100);
    } else {
      for (let i = this.heightArray.length - 1; i >= 0; i--) {
        if (
          Math.ceil(scrollHeight / (clientHeight + 200)) < this.heightArray[i]
        ) {
          productAPI.currentPage = i + 1;
        }
      }
    }
  }
  async handlePageChange(pageNum) {
    let paginationDivs = document.getElementsByClassName("button");
    let containerDivs = document.getElementsByClassName("number-list");

    let productsContainer = document.getElementById("products-container");
    let scrollWidth = paginationDivs[1].clientWidth;
    if (pageNum > productAPI.currentPage) {
      if (pageNum >= 1 && pageNum <= productAPI.totalPages) {
        productAPI.currentPage = pageNum;
        render.renderPagination(productAPI.totalPages);

        if (paginationDivs.length > 1 && containerDivs.length > 0) {
          containerDivs[0].scrollTo({
            left: 1.75 * scrollWidth * pageNum,
            behavior: "smooth",
          });
        } else {
          console.error(
            "Elements with the class names 'button' or 'number-list' not found."
          );
        }
        productAPI.offset = (pageNum - 1) * productAPI.limit;
        let data = await productAPI.fetchpagedata(
          productAPI.limit,
          productAPI.offset
        );
        await render.renderProducts(data);
      }
    } else {
      let clientHeight = productsContainer.clientHeight;
      productsContainer.scrollTo({
        top: pageNum * clientHeight,
        behavior: "smooth",
      });
      let buttons = document.getElementsByClassName("button");
      productAPI.currentPage = pageNum;
      render.renderPagination(productAPI.totalPages);
    }
  }

  async handleOptionChange() {
    this.heightArray = [];
    productAPI.limit = document.querySelector(".options").value;
    productAPI.currentPage = 1;
    render.renderPagination(productAPI.totalPages);
    this.pagepositions = {};

    productAPI.offset = 0;
    productAPI.completeData = [];
    let data = await productAPI.fetchpagedata();
    productAPI.offset += productAPI.limit;
    await render.renderProducts(data);
  }
  catch(error) {
    console.error("Error fetching paged data on option change:", error);
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
