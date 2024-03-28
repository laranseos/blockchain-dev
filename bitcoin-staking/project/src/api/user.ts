import axios from "axios";

export const setUserName = async (username: string, userId: Number) => {
  return await axios.post(`https://flickthebean.onrender.com/set_username`, {
    userId: userId,  
    userName: username
  }).then(function (res) {
    return res;
  }).catch(function (error) {
    console.log(error.toJSON());
  });
}