import { Router } from "express";
import { upload } from "../middleware/multer";

const images = Router();

images.post("/upload", upload.array("images", 5), (req, res) => {
    try {
        const files = req.files as Express.Multer.File[];
        const protocol = req.protocol;
        const host = req.get('host');

        const imagePaths = files.map((file) =>
            `${protocol}://${host}/Images/${file.filename}`
        );

        res.json({ message: "Image uploaded successfully", imagePaths });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default images;