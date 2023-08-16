import axios from "axios";

export const newRefreshToken = async() => {
  const refreshToken = localStorage.getItem("refreshToken")
  if (!refreshToken) {
      return false
  } else {
      // make post request to /refresh
      try {
          const res = await axios.post(`/users/refresh`,
          {"refreshToken": refreshToken});
          //test
          if (res.status === 200) {
              return true;
          } else {
              return false;
          }
      } catch(e) {
          return false
      }
  }
}