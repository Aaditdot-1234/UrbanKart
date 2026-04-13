import path from 'path';
import multer from 'multer';
import { v4 as uuidv4} from "uuid";
import {ValidationError} from '../errors/appError'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../productImages'));
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: any, cb:any) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new ValidationError("Invalid file type. Only jpeg, png, jpg, webp allowed"))
    }
}

export const upload = multer({ storage, fileFilter, limits: {
    fileSize: 5 * 1024 * 1024
}});