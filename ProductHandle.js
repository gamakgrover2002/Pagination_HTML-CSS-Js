class ProductHandle {
  constructor() {
    this.scrollTop = 0;
    this.elem = document.getElementById("products-container");
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
          let containerDivs = document.getElementsByClassName("number-list");
          productAPI.currentPage = Math.ceil(
            scrollHeight / (clientHeight + 200)
          );
          let data = await productAPI.fetchpagedata();

          productAPI.offset += productAPI.limit;

          await render.renderProducts(data);
          render.renderPagination(productAPI.totalPages);
          let paginationDivs = document.getElementsByClassName("button");

          let scrollWidth = paginationDivs[1].clientWidth;

          if (paginationDivs.length > 1 && containerDivs.length > 0) {
            containerDivs[0].scrollTo({
              left: 1.7 * scrollWidth * productAPI.currentPage,
            });
          }

          this.scrollTop = scrollTop;

          productAPI.heightArray.push(Math.ceil(scrollTop));
        } catch (error) {
          console.error("Error updating pagination and scroll:", error);
        }
      }, 10);
    } else {
      let containerDivs = document.getElementsByClassName("number-list");
      for (let i = 1; i < productAPI.heightArray.length; i++) {
        if (
          scrollTop >= productAPI.heightArray[i - 1] &&
          scrollTop < productAPI.heightArray[i]
        ) {
          let paginationDivs = document.getElementsByClassName("button");
          let scrollWidth = paginationDivs[1].clientWidth;
          productAPI.currentPage = i;

          render.renderPagination(productAPI.totalPages);

          containerDivs[0].scrollTo({
            left: 1.5 * scrollWidth * productAPI.currentPage,
          });
          break;
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
      if (pageNum < productAPI.maxLoaaded) {
        let clientHeight = productsContainer.clientHeight;
        productsContainer.scrollTo({
          top: pageNum * clientHeight,
          behavior: "smooth",
        });
        productAPI.currentPage = pageNum;
        render.renderPagination(productAPI.totalPages);
      } else {
        if (pageNum < productAPI.maxLoaaded) {
          let clientHeight = productsContainer.clientHeight;
          productsContainer.scrollTo({
            top: pageNum * clientHeight,
            behavior: "smooth",
          });
          render.renderPagination(pageNum);
        } else {
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
        }
      }
    } else {
      let clientHeight = productsContainer.clientHeight;
      productsContainer.scrollTo({
        top: pageNum * clientHeight,
      });

      productAPI.currentPage = pageNum;
      render.renderPagination(productAPI.totalPages);
    }
  }

  handleOptionChange() {
    let elem = document.getElementById("products-container");
    let limit = document.querySelector(".options").value;
    if (limit > productAPI.limit) {
      this.heightArray = [];

      productAPI.currentPage = Math.ceil(
        productAPI.completeData.length / limit
      );

      let heightperpage =
        elem.scrollHeight / (productAPI.currentPage * productAPI.offset);

      render.renderPagination(productAPI.totalPages);
      let newHeightArray = [];
      productAPI.totalPages = Math.round(productAPI.total / limit);

      for (let i = 1; i <= productAPI.totalPages; i++) {
        newHeightArray.push(heightperpage * i);
      }
      productAPI.heightArray = newHeightArray;

      productAPI.offset = productAPI.completeData.length % productAPI.limit;
    } else {
      let heightperpage =
        elem.scrollHeight / (productAPI.currentPage * productAPI.offset);

      productAPI.totalPages = Math.round(productAPI.total / limit);
      let newHeightArray = [];
      for (let i = 1; i <= productAPI.totalPages; i++) {
        newHeightArray.push(heightperpage * i);
      }
      productAPI.heightArray = newHeightArray;
      productAPI.currentPage = Math.ceil(
        productAPI.completeData.length / limit
      );

      productAPI.totalPages = Math.round(productAPI.total / limit);
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
