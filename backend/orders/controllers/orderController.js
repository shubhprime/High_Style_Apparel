// Handles API requests
import { createOrder, allOrders, singleOrder, updateOrderStatus, cancelOrder, allUsersOrders } from "../services/orderService.js";
import { getOrderModel } from '../../models/orderDB.js';
import { getProductModel } from "../../models/productDB.js";


// Create a new order
export const createNewOrder = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from authentication middleware
        const order = await createOrder(userId, req.body);
        return res.status(201).json({ success: true, order });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Get orders of all users
export const getAllUsersOrders = async (req, res) => {
    try {
      const {
        page = 1,
        pageSize = 20,
        sort = null,
        search = "",
      } = req.query;
  
      const data = await allUsersOrders({
        page: Number(page),
        pageSize: Number(pageSize),
        sort,
        search,
      });
  
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

// Get all orders of a user
export const getAllOrders = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Not A User" });
    }

    try {
        const Order = getOrderModel();
        const Product = getProductModel();
        
        const orders = await Order.find({ userId }).populate({
            path: "items.productId",
            model: Product,
        });

        return res.json({ success: true, orders });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Get a single order
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await singleOrder(orderId);
        return res.status(200).json({ success: true, order });
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

// Update order status
export const changeOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const updatedOrder = await updateOrderStatus(orderId, status);
        return res.status(200).json({ success: true, message: "Order status updated", order: updatedOrder });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Cancel order
export const cancelUserOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const cancelledOrder = await cancelOrder(orderId);
        return res.status(200).json({ success: true, message: "Order cancelled", order: cancelledOrder });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};