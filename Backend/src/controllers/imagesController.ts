import { Router } from "express";
import { upload } from "../middleware/multer";

const images = Router();

images.post("/upload", upload.array("images", 5), (req, res) => {
    try {
        const files = req.files as Express.Multer.File[];

        // Strip the leading "public/" so the stored path works with the /images static route
        // e.g. "public/uploads/123.jpg" → "uploads/123.jpg" → served at GET /images/uploads/123.jpg
        const imagePaths = files.map((file) =>
            file.path.replace(/^public[\\/]/, '')
        );

        res.json({ message: "Image uploaded successfully", imagePaths });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default images;