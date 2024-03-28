import axios from "axios";

export const GetrecentFlickers = async () => {
  return await axios.get(`https://flickthebean.onrender.com`, {
  }).then(function (res) {
    return  res.data.data;
  }).catch(function (error) {
    console.log(error.toJSON());
  });
}