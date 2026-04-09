import { Router } from "express";
import { AddressController } from "../controllers/addressController";

const addressRoutes = Router();

addressRoutes.post('/add', AddressController.addAddress);
addressRoutes.get('/get-all', AddressController.getAllAddresses);
addressRoutes.patch('/update/:addressId', AddressController.updateAddress);
addressRoutes.delete('/delete/:addressId', AddressController.deleteAddress);

export default addressRoutes;

