# Taxi Service API

## Overview

This project implements a taxi service API with a bidding system. Clients can submit ride requests with proposed prices, and fleets can view and bid on these requests.

## Features

1. **Request a Ride:**
   - Allow clients to request a ride by providing details such as pickup location, drop-off location, and their proposed price.
   - Verify that the response confirms the successful ride request.

2. **View Ride Requests:**
   - Allow fleets to view a list of ride requests from clients, including details like pickup/drop-off locations, date-time, and proposed prices.
   - Verify that the response contains details of available ride requests.

3. **Make Bid on Ride:**
   - Allow fleets to place bids on a specific ride request.
   - Verify that the response confirms the successful bid placement.

4. **View Bids on Ride:**
   - Allow clients to view bids received for their requested ride.
   - Verify that the response contains details of bids received on the ride.

5. **Accept Bid:**
   - Allow clients to accept a bid for a specific ride request, closing the bidding process.
   - Verify that the response confirms the successful bid acceptance.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB (using Mongoose)
- Docker
- Terraform that uploads to GCP

## Project Structure

- `src/`: Source code directory
  - `app.ts`: Main file
  - `models/`: Mongoose models directory
  - `controllers/`: Business logic directory
  - `routes/`: API routes directory
- `tests/`: Test files

## Getting Started

1. Clone the repository and start the project: (replace your-mongo-db-password and SERVER_NAME with your server)
   ```powershell
   git clone <repository-url>
   npm install
   $env:DB_PASSWORD="your-mongo-db-password"; $env:"SERVER_NAME"="your-mongo-db-server-name"; npm start

2. Access the API at http://localhost:3000.

## API Endpoints

- Request a Ride:
  - POST /rides
- View Ride Requests: 
  - GET /rides
- Make Bid on Ride: 
  - POST /rides/:rideId/bids
- View Bids on Ride: 
  - GET /rides/:rideId/bids
- Accept Bid: 
  - POST /rides/:rideId/accept-bid
- Delete Ride Request: 
  - DELETE /rides/:rideId

## Testing

```powershell
$env:DB_PASSWORD=”your-mongo-db-password”; $env:SERVER_NAME="your-mongo-db-server-name"; npm test
```
## Dockerization

```powershell
$env:DB_PASSWORD="your-mongo-db-password"; $env:"SERVER_NAME"="your-mongo-db-server-name"; docker-compose up
```

## Terraform to GCP

1. Configure main.tf to fit your GCP environment.
2. 
   ```powershell
   gcloud auth login
   gcloud config set project [YOUR_PROJECT_ID]
   terraform init
   terraform apply
   ```