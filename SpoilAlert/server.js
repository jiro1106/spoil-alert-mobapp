const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://AJ:veggie@veggiedata.gdafs7i.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Mongoose schema
const SensorDataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  co2: Number,
  ethylene: Number,
  vegetable: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose model
const SensorData = mongoose.model('SensorData', SensorDataSchema);

// GET all sensor data
app.get('/api/sensor-data', async (req, res) => {
  try {
    const data = await SensorData.findOne().sort({ timestamp: -1 });
    console.log('📊 Latest data:', data);
    res.json([data]); // Wrap in array to maintain compatibility with frontend
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST sensor data
app.post('/api/data', async (req, res) => {
  const { temperature, humidity, co2, ethylene, vegetable } = req.body;

  if (
    temperature === undefined || humidity === undefined ||
    co2 === undefined || ethylene === undefined || !vegetable
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newData = new SensorData({ temperature, humidity, co2, ethylene, vegetable });
    await newData.save();
    console.log('📦 Data saved:', newData);
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (err) {
    console.error('❌ Error saving data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ✅ Listen on all interfaces, including LAN IP
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
  console.log(`🌐 Access via your IP: http://<your-ip>:${PORT}/api/sensor-data`);
});
