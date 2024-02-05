import mongoose, { Schema, Document } from 'mongoose';

interface Bid {
  fleetId: string;
  bidAmount: number;
  _id?: string;
}

interface IRide extends Document {
  clientId: string;
  pickupLocation: string;
  dropoffLocation: string;
  proposedPrice: number;
  bids: Bid[];
  acceptedBid?: string; 
}

const BidSchema: Schema = new Schema({
  fleetId: { type: String, required: true },
  bidAmount: { type: Number, required: true }
},{ _id: true });

const RideSchema: Schema = new Schema({
  clientId: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  proposedPrice: { type: Number, required: true },
  bids: [BidSchema],
  acceptedBid: { type: Schema.Types.ObjectId, ref: 'Bid', required: false } // Reference to the Bid schema
});

export default mongoose.model<IRide>('Ride', RideSchema)