// Business logic for orders
import { getOrderModel } from "../../models/orderDB.js";
import { getProductModel } from "../../models/productDB.js";

// Create a new Order
export const createOrder = async (userId, orderData) => {
    const { items, totalAmount, paymentMethod, shippingAddress, phone } = orderData;

    if (!userId || !items || !totalAmount || !paymentMethod || !shippingAddress || !phone) {
        throw new Error("Missing Details");
    }

    if (items.length === 0) {
        throw new Error("You need to select something to proceed with purchasing");
    }

    if (totalAmount <= 0) {
        throw new Error("Total amount should be greater than 0");
    }

    if (!shippingAddress.house || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
        throw new Error("Shipping Address is required")
    }

    try {
        const Order = getOrderModel();
        const newOrder = new Order({
            userId: userId,
            items,
            totalAmount,
            paymentMethod,
            shippingAddress,
            phone,
            status: "Pending"
        });

        await newOrder.save();

        return { success: true, message: "Order Placed Successfully" };

    } catch (error) {
        throw new Error(error.message);
    }
}

// Get all orders of a user
export const allOrders = async (userId) => {
    if (!userId) {
        throw new Error("Not A User");
    }

    try {

        const Order = getOrderModel();
        const orders = await Order.find({ userId }).populate("items.productId");

        return res.json({ success: true, orders });

    } catch (error) {
        throw new Error(error.message);
    }
}

// Get a single order by orderId
export const singleOrder = async (orderId) => {
    if (!orderId) {
        throw new Error("Order Id is required");
    }

    try {
        const Order = getOrderModel();
        const Product = getProductModel();  // Ensure Product is initialized

        const order = await Order.findById(orderId).populate({
            path: "items.productId",
            model: Product,  // ⬅️ Use actual `Product` model here
        });

        if (!order) {
            throw new Error("Order not found");
        }

        return order;

    } catch (error) {
        throw new Error(error.message);
    }
};

// Update Order Status
export const updateOrderStatus = async (orderId, status) => {

    try {
        const Order = getOrderModel();
        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        // Update status and timestamps
        if (status === "Shipped") {
            order.status = "Shipped";
            order.shippedAt = new Date();
        } else if (status === "Delivered") {
            order.status = "Delivered";
            order.deliveredAt = new Date();
        } else if (status === "Cancelled") {
            order.status = "Cancelled";
            order.cancelledAt = new Date();
        } else {
            return res.json({ success: false, message: "Invalid Status" });
        }

        await order.save();

        return{ success: true, message: "Order status updated", order };

    } catch (error) {
        throw new Error(error.message);
    }
}

// Cancel an order
export const cancelOrder = async (orderId) => {

    try {
        const Order = getOrderModel();
        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error("Order not found");
        }
        if (order.status === "Delivered") {
            throw new Error("Delivered orders can't be cancelled");
        }

        return await Order.findByIdAndUpdate(orderId, { status: "Cancelled", cancelledAt: new Date() }, { new: true });
    } catch (error) {
        throw new Error(error.message);
    }
};