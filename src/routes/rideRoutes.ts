import { Router } from 'express';
import {
  requestRide,
  viewRideRequests,
  makeBidOnRide,
  viewBidsOnRide,
  acceptBid,
  deleteRideRequest
} from '../controllers/rideController';

const router = Router();

// 1. Request a Ride
// POST /api/rides
router.post('/', requestRide);

// 2. View Ride Requests
// GET /api/rides
router.get('/', viewRideRequests);

// 3. Make Bid on Ride
// POST /api/rides/:rideId/bids
router.post('/:rideId/bids', makeBidOnRide);

// 4. View Bids on Ride
// GET /api/rides/:rideId/bids
router.get('/:rideId/bids', viewBidsOnRide);

// 5. Accept Bid
// POST /api/rides/:rideId/bids/:bidId/accept
router.post('/:rideId/bids/:bidId/accept', acceptBid);

router.delete('/:rideId', deleteRideRequest);

export default router;