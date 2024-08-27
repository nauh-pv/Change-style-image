import axios from "axios";

const postUploadImage = (image) => {
  const formData = new FormData();
  formData.append("file", image);
  return axios.post("https://5579.mekongai.io/upload_image/", formData);
};

const postGenerateImage = (nameImage, background, style) => {
  return axios.post("https://public.mekongai.com/style_snap", {
    url: `https://5579.mekongai.io/images/uploads/${nameImage}`,
    background,
    style,
  });
};
export { postUploadImage, postGenerateImage };
