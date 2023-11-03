import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

class AuthService {
  authHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      return { Authorization: "Bearer " + user.token.replace("JWT ", "") };
    } else {
      return {};
    }
  }

  // async login(userData) {
  //   const response = await axios.post(API_URL + "/api/auth/login", userData);
  //   if (response.data) {
  //     localStorage.setItem("user", JSON.stringify(response.data));
  //     return response.data;
  //   }
  // }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("CurrentUser為：", user);
    return user ? user : null;
  }

  getUserProfile() {
    const headers = this.authHeader();
    if (!headers.Authorization) return null;
    return axios.get(API_URL + "/api/profile", { headers });
  }

  async mockLogin(userData) {
    return axios.post(API_URL + "/api/auth/mock", userData);
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
