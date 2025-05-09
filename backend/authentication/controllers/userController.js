import { getOrderModel, getOverallStatModel } from "../../models/orderDB.js";
import { getUserModel } from "../../models/userDB.js";
import getCountryIso3 from "country-iso-2-to-3";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID missing' });
        }

        const user = await getUserModel().findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                verified: user.verified
            }
        });

    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
}

// Get all users (Super-Admin Only)
export const getAllUsers = async (req, res) => {
    try {
        const User = getUserModel();
        const users = await User.find().select("-password"); // Exclude passwords
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a specific user by ID (Admin & Super-Admin)
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const User = getUserModel();
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a user's geographical location (Admin & Super-Admin)
export const getGeography = async (req, res) => {
    try {
        const User = getUserModel();
        const users = await User.find();

        const mappedLocations = users.reduce((acc, user) => {
            const country = user.homeAddress?.country;
            const countryISO3 = getCountryIso3(country);
            if (!countryISO3) return acc; // <- added check
            if (!acc[countryISO3]) {
                acc[countryISO3] = 0;
            }
            acc[countryISO3]++;
            return acc;
        }, {});


        const formattedLocations = Object.entries(mappedLocations).map(
            ([country, count]) => {
                return { id: country, value: count };
            }
        );

        res.status(200).json(formattedLocations);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get relevant information for the admin panel dashboard
export const getDashboardStats = async (req, res) => {
    try {
        const Order = getOrderModel();

        // hardcoded values
        const currentMonth = "August";
        const currentYear = 2025;
        const currentDay = "2025-08-01";

        /* Recent Transactions */
        const transactions = await Order.find()
            .limit(50)
            .sort({ createdAt: -1 });

        /* Overall Stats */
        const overallStat = await getOverallStatModel().find({ year: currentYear });

        const {
            totalCustomers,
            yearlyTotalSoldUnits,
            yearlySalesTotal,
            monthlyData,
            salesByCategory,
        } = overallStat[0];

        const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
            return month === currentMonth;
        });

        const todayStats = overallStat[0].dailyData.find(({ date }) => {
            return date === currentDay;
        });

        res.status(200).json({
            totalCustomers,
            yearlyTotalSoldUnits,
            yearlySalesTotal,
            monthlyData,
            salesByCategory,
            thisMonthStats,
            todayStats,
            transactions,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};