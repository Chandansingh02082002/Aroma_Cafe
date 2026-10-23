const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    console.log("========== IMAGE UPLOAD ==========");
    console.log("File received:", req.file);

    console.log("Cloudinary config:", {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKeyExists: Boolean(process.env.CLOUDINARY_API_KEY),
      apiSecretExists: Boolean(
        process.env.CLOUDINARY_API_SECRET
      ),
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file received",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "aroma/menu",
          resource_type: "image",
        },
        (error, uploadResult) => {
          if (error) {
            console.error("CLOUDINARY ERROR:", error);
            reject(error);
            return;
          }

          resolve(uploadResult);
        }
      );

      stream.end(req.file.buffer);
    });

    console.log("Cloudinary upload successful:", result.secure_url);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("UPLOAD CONTROLLER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image",
    });
  }
};

module.exports = {
  uploadImage,
};