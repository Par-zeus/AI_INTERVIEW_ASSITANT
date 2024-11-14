const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

const supportedFormats = ['jpeg', 'png', 'jpg', 'gif','webp'];

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Extract file format
    const fileFormat = file.mimetype.split('/')[1];

    // Validate file format
    if (!supportedFormats.includes(fileFormat)) {
      throw new Error('Unsupported file format');
    }

    // Return the configuration for the file upload
    return {
      folder: 'ClothesAndUsers', // Specify the folder
      format: fileFormat, // Specify the format
      public_id: file.originalname.split('.')[0].replace(/[^a-zA-Z0-9-_]/g, ""), // Generate a safe public_id
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
