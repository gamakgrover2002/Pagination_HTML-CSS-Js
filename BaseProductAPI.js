class BaseProductAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(productAPI.maxLoaded);
      return await response.json();
    } catch (err) {
      console.error("Error fetching data:", err);
      return null;
    }
  }
}

const baseProductAPI = new BaseProductAPI("https://dummyjson.com/products");
