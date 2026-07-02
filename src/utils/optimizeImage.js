// utils/optimizeImage.js

export const optimizeImage = (url) => {
  if (!url?.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,c_fill,w_400,h_300/"
  );
};