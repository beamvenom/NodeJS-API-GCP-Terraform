import { Request, Response } from 'express';
import Ride from '../models/Ride';

export const requestRide = async (req: Request, res: Response) => {
  try {
    const { clientId, pickupLocation, dropoffLocation, proposedPrice } = req.body;
    
    const newRide = new Ride({
      clientId,
      pickupLocation,
      dropoffLocation,
      proposedPrice,
      bids: []
    });

    await newRide.save();

    res.status(201).json(newRide);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};


export const viewRideRequests = async (req: Request, res: Response) => {
  try {
    const rides = await Ride.find(); 
    res.status(200).json(rides); 
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const makeBidOnRide = async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const { fleetId, bidAmount } = req.body;

  try {
    if(fleetId === ''){
      return res.status(400).json({ message: "fleetId cannot be empty" });
    }
    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { $push: { bids: { fleetId, bidAmount } } },
      { new: true }
    );  
    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const viewBidsOnRide = async (req: Request, res: Response) => {
  const { rideId } = req.params;

  try {
    const ride = await Ride.findById(rideId).select('bids');
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json(ride.bids);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const acceptBid = async (req: Request, res: Response) => {
  const { rideId, bidId } = req.params;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const bidExists = ride.bids.some(bid => bid._id?.toString() === bidId);
    if (!bidExists) {
      return res.status(404).json({ message: 'Bid not found on this ride' });
    }

    ride.acceptedBid = bidId;
    await ride.save();

    res.status(200).json({ message: 'Bid accepted successfully', ride });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const deleteRideRequest = async (req: Request, res: Response) => {
  const { rideId } = req.params;

  try {
    const ride = await Ride.findByIdAndDelete(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json({ message: 'Ride request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};