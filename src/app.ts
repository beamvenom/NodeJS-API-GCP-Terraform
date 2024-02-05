import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import rideRoutes from './routes/rideRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

const dbPassword = process.env.DB_PASSWORD;
const serverName = process.env.SERVER_NAME;

app.use(bodyParser.json());

const mongoURI: string = `mongodb+srv://${serverName}:${dbPassword}@cluster0.nxlk7zr.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connection established'))
  .catch((error) => console.error('MongoDB connection failed:', error.message));

app.use('/api/rides', rideRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Taxi Service API is running...');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app