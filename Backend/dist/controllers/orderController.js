"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const asyncHandler_1 = require("../errors/asyncHandler");
const orderService_1 = require("../services/orderService");
const Orders_1 = require("../entities/Orders");
const Payments_1 = require("../entities/Payments");
class OrderController {
}
exports.OrderController = OrderController;
_a = OrderController;
OrderController.creationOfOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { addressId } = req.body;
    const loggedInUserInfo = req.user;
    const order = await orderService_1.OrderService.createOrder(loggedInUserInfo.id, addressId);
    res.status(200).json({ message: "Order created successfully.", order });
});
OrderController.creationOfDirectOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { addressId, productId, quantity } = req.body;
    const loggedInUserInfo = req.user;
    const order = await orderService_1.OrderService.createDirectOrder(loggedInUserInfo.id, addressId, productId, quantity);
    res.status(201).json({
        message: "Direct order created successfully.",
        order
    });
});
OrderController.getAllOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const loggedInUserInfo = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [orders, total] = await orderService_1.OrderService.getOrdersByUser(loggedInUserInfo.id, skip, limit);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        message: "Orders fetched successfully.", orders, meta: {
            totalItems: total,
            itemCount: orders.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }
    });
});
OrderController.getOrderById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { orderId } = req.params;
    const order = await orderService_1.OrderService.getOrderById(+orderId);
    res.status(200).json({ message: "Order fetched successfully.", order });
});
OrderController.filterorderbyDate = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const loggedInUser = req.user;
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [orders, total] = await orderService_1.OrderService.filterByDate(loggedInUser.id, start, end, skip, limit);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        message: "Orders fetched successfully.", orders, meta: {
            totalItems: total,
            itemCount: orders.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }
    });
});
OrderController.filterOrderByStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const loggedInUser = req.user;
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [orders, total] = await orderService_1.OrderService.filterByStatus(loggedInUser.id, status, limit, skip);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        message: "Orders fetched successfully.", orders, meta: {
            totalItems: total,
            itemCount: orders.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }
    });
});
OrderController.updateOrderStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { orderId, payment_method } = req.body;
    await orderService_1.OrderService.updateStatus(+orderId, payment_method);
    res.status(200).json({ message: `Order status updated to '${Orders_1.OrderStatus.Completed} and payment status is updated to ${Payments_1.PaymentStatus.Completed}'.` });
});
