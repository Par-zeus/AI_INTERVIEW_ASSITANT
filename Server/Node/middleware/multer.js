const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../uploads");
const resumesDir = path.join(uploadsDir, "resumes");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) cb(null, true);
  else cb(new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed."));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const handleFileUpload = (req, res, next) => {
  const uploadSingle = upload.single("resume");
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ message: "Upload error", error: err.message });
    }
    next();
  });
};

module.exports = handleFileUpload;