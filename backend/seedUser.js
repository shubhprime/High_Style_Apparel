const { initUserModel, User } = require("./models/userDB");


(async () => {
    try {
         // Wait for the User model to be initialized
         await initUserModel(); // Initialize the user model


        // Create a new user instance
        const newUser = new User({
            firstName: "Jane",
            lastName: "Doe",
            email: "jane.doe@example.com",
            password: "google", // In a real-world scenario, hash the password
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
