const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

describe('Integration Test Suite: POST /api/v1/products', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(process.env.TEST_DB_URI || 'mongodb://localhost:27017/techcart_test', { serverSelectionTimeoutMS: 1000 });
      } catch (err) {
        // Fallback for offline test environments
      }
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it('should create a new product and persist it to MongoDB', async () => {
    const newProduct = { name: 'Wireless Gaming Mouse', price: 79.99, category: 'Electronics' };
    const response = await request(app)
      .post('/api/v1/products')
      .send(newProduct)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.data.product.name).toBe('Wireless Gaming Mouse');
    expect(response.body.data.product._id).toBeDefined();
  });
});
