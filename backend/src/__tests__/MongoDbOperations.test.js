const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    jest.setTimeout(50000);

    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
});

afterAll(async () => {
    if (mongoose.connection) {
        await mongoose.connection.close();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('Invoice Model Tests', () => {
    test('should create a valid invoice', async () => {
        const invoice = new Invoice({
            userId: 'user123',
            name: 'Test Invoice',
            amount: 100,
            date: new Date(),
            dueDate: new Date(),
            payer: 'John Doe',
            statusSent: true,
            statusPaid: false,
        });

        const savedInvoice = await invoice.save();
        expect(savedInvoice._id).toBeDefined();
        expect(savedInvoice.userId).toBe('user123');
        expect(savedInvoice.amount).toBe(100);
        expect(savedInvoice.statusSent).toBe(true);
        
    });

    test('should throw an error if userId is not provided', async () => {
        const invoice = new Invoice({
            name: 'Test Invoice',
            amount: 100,
            date: new Date(),
        });

        await expect(invoice.save()).rejects.toThrowError('Invoice validation failed: userId: Path `userId` is required.');
        
    });

    test('should create invoice with optional fields', async () => {
        const invoice = new Invoice({
            userId: 'user123',
            name: 'Invoice Without Amount',
        });

        const savedInvoice = await invoice.save();
        expect(savedInvoice.name).toBe('Invoice Without Amount');
        expect(savedInvoice.amount).toBeUndefined();
        
    });

    test('should store date and dueDate correctly', async () => {
        const date = new Date('2024-01-01');
        const dueDate = new Date('2024-02-01');

        const invoice = new Invoice({
            userId: 'user123',
            date,
            dueDate,
        });

        const savedInvoice = await invoice.save();
        expect(savedInvoice.date.toISOString()).toBe(date.toISOString());
        expect(savedInvoice.dueDate.toISOString()).toBe(dueDate.toISOString());
        
    });

    test('should update an invoice amount', async () => {
        const invoice = new Invoice({
            userId: 'user123',
            amount: 100,
        });

        const savedInvoice = await invoice.save();
        savedInvoice.amount = 200;
        const updatedInvoice = await savedInvoice.save();

        expect(updatedInvoice.amount).toBe(200);
        
    });

    test('should set statusSent and statusPaid to boolean values', async () => {
        const invoice = new Invoice({
            userId: 'user123',
            statusSent: true,
            statusPaid: false,
        });

        const savedInvoice = await invoice.save();
        expect(savedInvoice.statusSent).toBe(true);
        expect(savedInvoice.statusPaid).toBe(false);
        
    });

    test('should delete an invoice', async () => {
        const invoice = new Invoice({
            userId: 'user123',
            amount: 100,
        });

        const savedInvoice = await invoice.save();
        const deleteResult = await Invoice.deleteOne({_id: savedInvoice._id});

        expect(deleteResult.deletedCount).toBe(1);
        
    });

    test('should validate amount is a number if provided', async () => {
        const invoice = new Invoice({
            userId: 'user123',
            amount: 'not-a-number', // Invalid amount
        });

        await expect(invoice.save()).rejects.toThrowError(/Invoice validation failed: amount/);
        
    });

    test('should validate date is a date if provided', async () => {
        const invoice = new Invoice({
            userId: 'user123',
            dueDate: 'not-a-date', // Invalid amount
        });

        await expect(invoice.save()).rejects.toThrowError(/Invoice validation failed: dueDate/);

    });
});