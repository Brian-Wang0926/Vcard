import axios from "axios";
import { jwtDecode } from "jwt-decode";

class AuthService {
  authHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      return { Authorization: "Bearer " + user.token.replace("JWT ", "") };
    } else {
      return {};
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("getCurrentUser", user);
    if (user && this.isTokenValid(user.token)) {
      return user;
    } else {
      this.logout(); // 清除无效或过期的用户信息
      return null;
    }
  }

  isTokenValid(token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      return false; // 解析失败，视为无效Token
    }
  }

  getUserProfile() {
    return axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
      headers: authServiceInstance.authHeader(),
    });
  }

  async mockLogin(userData) {
    return axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/mock`,
      userData
    );
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
