class ProductAPI extends BaseProductAPI {
  constructor() {
    super();
    this.limit = 10;
    this.currentPage = 1;
    this.offset = 0;
    this.completeData = [];
    this.cache = {};
    this.total;
    this.totalPages = 0;
    this.prevPage = 1;
  }
  async fetchpagedata() {
    if (this.currentPage > this.totalPages && this.currentPage != 1) {
      this.currentPage = this.totalPages;
      render.renderPagination(this.totalPages);
    }
    let endpoint = `?limit=${this.limit}&skip=${this.offset}&select=title,price`;
    if (endpoint in this.cache) {
      return this.cache[endpoint];
    }
    this.prevPage = this.currentPage;

    const response = await baseProductAPI.get(endpoint);
    let data = response.products;
    this.completeData = [...this.completeData, ...data];
    this.cache[endpoint] = this.completeData;
    this.totalPages = Math.ceil(response.total / this.limit);
    console.log(this.currentPage);
    return this.completeData;
  }
}

const productAPI = new ProductAPI();
