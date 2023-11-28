import axios from "axios";

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
    console.log("CurrentUser為：", user);
    return user ? user : null;
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
