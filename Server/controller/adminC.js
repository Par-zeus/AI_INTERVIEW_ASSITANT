const user=require("../model/user");
const cloudinary=require("cloudinary").v2;
const upload = require('../middleware/multer'); 

const mongoose=require("mongoose");
require("dotenv").config();
const fs= require("fs");

//add Category
const addCategory =async(req,res) =>{
  try{
    console.log(req.body);
    const categoryData ={
      categoryName: req.body.categoryName
    }
    console.log(categoryData);
    const category =new CategorySchema(categoryData);
    console.log(category);
    const savedCategory = await category.save();
    console.log(savedCategory);
    res.status(201).json({
      success: true,
      message: 'New Category Created',
      category: savedCategory,
    });
  }catch(err){
    console.error( err);
    res.status(500).json({
      success: false,
      message: err.message,
    }); 
  }
}

const addProduct = async (req, res) => {
  try {
    // Ensure all required fields are provided and correctly named
    const productData = {
      name: req.body.name,
      description: req.body.description,
      categoryName: req.body.categoryName, // Corrected typo here
      size: req.body.sizes,  // Expecting an array of sizes
      cost: {
        currency: req.body.currency,
        value: req.body.value,
      },
      frontPicture: req.body.frontPicture,
      picture: req.body.picture,  // Expecting an array of pictures
      // Map colors to the required format
      color: req.body.colors.map(colorCode => ({ colorCode })),
    };

    // Log the incoming product data for debugging purposes
    console.log(productData);

    // Create a new product instance
    const product = new ProductSchema(productData);

    // Save the product to the database
    const savedProduct = await product.save();

    // Respond with the saved product data
    res.status(201).json({
      success: true,
      message: 'New Product added',
      product: savedProduct,
    });
  } catch (err) {
    // Log the error and respond with an error message
    console.error('Error adding product:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};







// const addSingleImagesForProduct =(req,res)=>{
//   upload.single('photo')(req, res, async (err) => {
//     console.log(req.file);
//     console.log(req.body);
//     if (err) {
//       console.error('Error during file upload:', err);
//       return res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }

//     if (req.file) {
//       try {
//         // Upload the single file to Cloudinary
//         const result = await cloudinary.uploader.upload(req.file.path);

//         // Return the URL of the uploaded image
//         res.status(200).json({
//           success: true,
//           message: 'File uploaded successfully',
//           fileUrl: result.secure_url,
//         });
//       } catch (uploadError) {
//         console.log('Cloudinary upload error:', uploadError);
//         res.status(500).json({ message: 'File upload failed', error: uploadError.message });
//       }
//     } else {
//       console.log('No file uploaded');
//       res.status(500).json({ message: 'No file uploaded' });
//     }
//   });
// }
// const addImagesForProduct = (req, res) => {
//   console.log("Monu");
//   console.log(req.files);
//     console.log(req.body);
//   upload.array('photos', 10)(req, res, async (err) => {
    
//     if (err) {
//       console.error('Error during file upload:', err);
//       return res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
//     if (req.files && req.files.length > 0) {
//       try {
//         console.log(req.files);
//         // Array to hold the URLs of the uploaded images
//         const fileUrls = [];

//         // Iterate through the uploaded files and upload each to Cloudinary
//         for (const file of req.files) {
//           const result = await cloudinary.uploader.upload(file.path);
//           fileUrls.push(result.secure_url); // Add each URL to the array
//         }

//         // If you need to associate these URLs with a product, you can update the product document here.
//         // await ProductSchema.findByIdAndUpdate(req.body.productId, { images: fileUrls });

//         // Return the URLs of the uploaded images
//         res.status(200).json({
//           success: true,
//           message: 'Files uploaded successfully',
//           fileUrls: fileUrls,
//         });
//       } catch (uploadError) {
//         console.error('Cloudinary upload error:', uploadError);
//         res.status(500).json({ message: 'File upload failed', error: uploadError.message });
//       }
//     } else {
//       console.error('No files uploaded');
//       res.status(500).json({ message: 'No files uploaded' });
//     }
//   });
// };



module.exports = {
  addCategory,addProduct
};
 
