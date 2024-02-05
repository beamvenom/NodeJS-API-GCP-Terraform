import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import Ride from '../models/Ride';


const dbPassword = process.env.DB_PASSWORD;
const serverName = process.env.SERVER_NAME;

beforeAll(async () => {
  const url = `mongodb+srv://${serverName}:${dbPassword}@cluster0.nxlk7zr.mongodb.net/?retryWrites=true&w=majority`;
  await mongoose.connect(url);
});

afterEach(async () => {
  await Ride.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});



describe('POST /api/rides', () => {
  it('should create a new ride request', async () => {
    const newRide = {
      clientId: 'client123',
      pickupLocation: '123 Main St',
      dropoffLocation: '456 Elm St',
      proposedPrice: 20
    };

    const response = await request(app)
      .post('/api/rides')
      .send(newRide);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.clientId).toBe(newRide.clientId);
  });

  it('should return 400 for invalid ride request data', async () => {
    const invalidRide = {
      clientId: '',
      pickupLocation: '123 Main St',
    };

    const response = await request(app)
      .post('/api/rides')
      .send(invalidRide);

    expect(response.statusCode).toBe(400);
  });
});

describe('GET /api/rides', () => {
  it('should return all ride requests', async () => {
    const ride = new Ride({
      clientId: 'testClientId',
      pickupLocation: '123 Test St',
      dropoffLocation: '456 Test Ave',
      proposedPrice: 30,
      bids: []
    });
    await ride.save();

    const response = await request(app).get('/api/rides');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(1);
    expect(response.body[0].clientId).toBe(ride.clientId);
  });

  it('should return an empty array when there are no ride requests', async () => {
    const response = await request(app).get('/api/rides');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(0);
  });
});


describe('POST /api/rides/:rideId/bids', () => {
  let rideId:any;

  beforeEach(async () => {
    const ride = await new Ride({
      clientId: 'testClient',
      pickupLocation: '123 Main St',
      dropoffLocation: '456 Elm St',
      proposedPrice: 25,
    }).save();
    rideId = ride.id;
  });

  it('should successfully make a bid on a ride', async () => {
    const bid = {
      fleetId: 'testFleet',
      bidAmount: 20,
    };

    const response = await request(app)
      .post(`/api/rides/${rideId}/bids`)
      .send(bid);

    expect(response.statusCode).toBe(200);
    expect(response.body.bids).toHaveLength(1);
    expect(response.body.bids[0].fleetId).toBe(bid.fleetId);
  });

  it('should return 400 for a non-existent ride', async () => {
    const response = await request(app)
      .post(`/api/rides/nonExistentRideId/bids`)
      .send({ fleetId: 'testFleet', bidAmount: 20 });

    expect(response.statusCode).toBe(400);
    
  });

  it('should return 400 for invalid bid data', async () => {
    const invalidBid = { fleetId: '', bidAmount: 0 }; 

    const response = await request(app)
      .post(`/api/rides/${rideId}/bids`)
      .send(invalidBid);
    
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("fleetId cannot be empty")
  });
});

describe('GET /api/rides/:rideId/bids', () => {
  let rideId:any;

  beforeEach(async () => {
    const ride = await new Ride({
      clientId: 'testClient',
      pickupLocation: '123 Main St',
      dropoffLocation: '456 Elm St',
      proposedPrice: 25,
      bids: [{ fleetId: 'testFleet1', bidAmount: 20 }, { fleetId: 'testFleet2', bidAmount: 22 }]
    }).save();
    rideId = ride.id;
  });

  it('should return all bids for a specific ride', async () => {
    const response = await request(app).get(`/api/rides/${rideId}/bids`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should return an empty array when there are no bids', async () => {
    const rideWithoutBids = await new Ride({
      clientId: 'testClientNoBids',
      pickupLocation: '789 Main St',
      dropoffLocation: '101 Elm St',
      proposedPrice: 30
    }).save();

    const response = await request(app).get(`/api/rides/${rideWithoutBids.id}/bids`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it('should return 404 for a non-existent ride', async () => {
    const response = await request(app).get(`/api/rides/nonExistentRideId/bids`);

    expect(response.statusCode).toBe(500);
  });
});

describe('POST /api/rides/:rideId/bids/:bidId/accept', () => {
  let ride:any;
  let bidId:any;

  beforeEach(async () => {
    ride = await new Ride({
      clientId: 'testClient',
      pickupLocation: '123 Main St',
      dropoffLocation: '456 Elm St',
      proposedPrice: 25,
      bids: [{ fleetId: 'testFleet', bidAmount: 20 }]
    }).save();
    bidId = ride.bids[0]._id.toString();
  });

  it('should successfully accept a bid for the ride', async () => {
    const response = await request(app)
      .post(`/api/rides/${ride._id}/bids/${bidId}/accept`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ride.acceptedBid).toBe(bidId);
  });

  it('should return 404 if the ride does not exist', async () => {
    const fakeRideId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/api/rides/${fakeRideId}/bids/${bidId}/accept`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('Ride not found');
  });

  it('should return 404 if the bid does not exist on the ride', async () => {
    const fakeBidId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/api/rides/${ride._id}/bids/${fakeBidId}/accept`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('Bid not found');
  });
});

describe('DELETE /api/rides/:rideId', () => {
  let rideId:any;

  beforeEach(async () => {
    const ride = await new Ride({
      clientId: 'testClient',
      pickupLocation: '123 Main St',
      dropoffLocation: '456 Elm St',
      proposedPrice: 25
    }).save();
    rideId = ride._id.toString();
  });

  it('should successfully delete a ride request', async () => {
    const response = await request(app)
      .delete(`/api/rides/${rideId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('Ride request deleted successfully');

    const rideExists = await Ride.findById(rideId);
    expect(rideExists).toBeNull();
  });

  it('should return 404 if the ride does not exist', async () => {
    const nonExistentRideId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .delete(`/api/rides/${nonExistentRideId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('Ride not found');
  });
});