class ProductAPI extends BaseProductAPI {
  constructor() {
    super("https://dummyjson.com/products");
    this.limit = 10;
    this.currentPage = 1;
    this.offset = 0;
    this.completeData = [];
    this.cache = {};
    this.total = 0;
    this.totalPages = 0;
    this.prevPage = 1;
    this.maxLoaded = 0;
    this.heightArray = [];
  }

  async fetchPagedData() {
    if (this.currentPage === this.totalPages) {
      return this.completeData;
    }
    if (this.maxLoaded < this.currentPage) {
      this.maxLoaded = this.currentPage;
    }
    if (this.currentPage > this.totalPages && this.currentPage !== 1) {
      this.currentPage = this.totalPages;
      render.renderPagination(this.totalPages);
    }

    let endpoint = `?limit=${this.limit}&skip=${this.offset}&select=title,price`;
    if (this.cache[endpoint]) {
      return this.cache[endpoint];
    }

    this.prevPage = this.currentPage;

    const response = await baseProductAPI.get(endpoint);
    if (response) {
      let data = response.products;
      this.completeData = [...this.completeData, ...data];
      this.cache[endpoint] = this.completeData;
      this.totalPages = Math.ceil(response.total / this.limit);
      this.total = response.total;
    }

    return this.completeData;
  }
}

const productAPI = new ProductAPI();
