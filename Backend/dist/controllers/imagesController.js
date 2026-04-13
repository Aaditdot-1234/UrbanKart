"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../middleware/multer");
const images = (0, express_1.Router)();
images.post("/upload", multer_1.upload.array("images", 5), (req, res) => {
    try {
        const files = req.files;
        const protocol = req.protocol;
        const host = req.get('host');
        const imagePaths = files.map((file) => `${protocol}://${host}/Images/${file.filename}`);
        res.json({ message: "Image uploaded successfully", imagePaths });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = images;
