const baseUrl =
  import.meta.env.NODE_ENV === "development"
    ? import.meta.env.API_BASE_URL
    : "http://localhost:3001";

export default baseUrl;
