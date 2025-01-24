const connectDB = require("./db"); // Import the connectDB function
const getUserModel = require("./models/userDB"); // Import the User model function

(async () => {
    try {
        const { userConnection } = await connectDB(); // Connect to the database
        const User = getUserModel(); // Get the User model

        // Create a new user instance
        const newUser = new User({
            firstName: "Jane",
            lastName: "Doe",
            email: "jane.doe@example.com",
            company: "Acme Corp",
            phone: 9876543210,
            query: "Interested in your products",
        });

        // Save the new user to the database
        await newUser.save();
        console.log("New user added successfully!");

        process.exit(0); // Exit the script
    } catch (error) {
        console.error("Error inserting data:", error);
        process.exit(1); // Exit the script with an error code
    }
})();
