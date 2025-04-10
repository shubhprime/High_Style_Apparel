import { initUserModel, getUserModel } from './models/userDB.js';

(async () => {
    try {
        // Wait for the User model to be initialized
        await initUserModel();

        // Get the User model instance
        const UserModel = getUserModel();  // Accessing the model after initialization

        // Create a new user instance using the retrieved model
        const newUser = new UserModel({
            firstName: "Jane",
            lastName: "Doe",
            email: "1234.doe@example.com",
            password: "google", // In a real-world scenario, hash the password
            phone: 9876543210,
            homeAddress: {
                house: "123A",
                street: "Maple Street",
                city: "New York",
                state: "NY",
                postalCode: "10001",
                country: "USA"
            }
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
