const dotenv = require("dotenv");
const {connect, connection} = require("mongoose");

dotenv.config();

describe('Mongo Connect', () => {
    let dbURI;

    beforeAll(() => {
        jest.setTimeout(50000);

        dbURI = process.env.DB_URI;
    });

    test('should connect to MongoDB instance', async () => {
        try {
            await connect(dbURI);

            console.log("MongoDB connected successfully");

            const db = connection;
            expect(db.readyState).toBe(1);

        } catch (error) {
            console.error("Error connecting to MongoDB", error);
            throw new Error('MongoDB connection failed');
        }
    }, 50000);

    afterAll(async () => {
        await connection.close();
    });
});
