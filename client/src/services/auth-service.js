import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL_AUTH;

class AuthService {
  async login(userData) {
    const response = await axios.post(API_URL + "/login", userData);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user : null;
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;