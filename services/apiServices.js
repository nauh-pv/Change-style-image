import axios from "axios";

const postUploadImage = (image) => {
  const formData = new FormData();
  formData.append("file", image);
  return axios.post("https://5579.mekongai.io/upload_image/", formData);
};

const postGenerateImage = (nameImage, background, outfit, sex) => {
  return axios.post("https://5588.mekongai.io/style_snap", {
    url: `https://5579.mekongai.io/images/uploads/${nameImage}`,
    background,
    outfit,
    sex,
  });
};
export { postUploadImage, postGenerateImage };
