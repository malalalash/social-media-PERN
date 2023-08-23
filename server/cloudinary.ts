import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (file: string) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(file, options);
    const url = cloudinary.url(result.public_id, {
      width: 600,
      height: 600,
      crop: "fill",
    });
    console.log(url, result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const deleteImage = async (public_id: string) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
