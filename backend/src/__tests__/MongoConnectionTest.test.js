const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

describe('Mongo Connect', () => {
    let dbURI;

    beforeAll(() => {
        jest.setTimeout(50000);
        dbURI = process.env.DB_URI;
    });

    test('should connect to MongoDB instance', async () => {
        try {
            await mongoose.connect(dbURI);

            console.log("MongoDB connected successfully");

            expect(mongoose.connection.readyState).toBe(1);
        } catch (error) {
            console.error("Error connecting to MongoDB", error);
            throw new Error('MongoDB connection failed');
        }
    }, 50000);

    afterAll(async () => {
        try {
            if (mongoose.connection.readyState === 1) {
                await mongoose.disconnect();
                console.log("MongoDB connection closed");
            }
        } catch (error) {
            console.error("Error during disconnect", error);
        }
    });
});