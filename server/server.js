const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// --- UDP Discovery dependencies ---
const dgram = require('dgram');
const os = require('os');

// Initialize app
const app = express();
const PORT = 3000;
// --- UDP Discovery constants ---
const DISCOVERY_PORT = 8266;

// --- UDP Discovery Server Setup ---
const udpServer = dgram.createSocket('udp4');

// Get server's IP address
const networkInterfaces = os.networkInterfaces();
let serverIP = '';
for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
            serverIP = iface.address;
            break;
        }
    }
    if (serverIP) break;
}

udpServer.on('error', (err) => {
    console.error(`UDP Server error:\n${err.stack}`);
    udpServer.close();
});

udpServer.on('message', (msg, rinfo) => {
    const message = msg.toString();
    console.log(`Received discovery message from ${rinfo.address}:${rinfo.port}: ${message}`);
    if (message === 'SPOILALERT_DISCOVER') {
        // Send response with server IP and port
        const response = `SPOILALERT_SERVER:${serverIP}:${PORT}`;
        udpServer.send(response, rinfo.port, rinfo.address, (err) => {
            if (err) {
                console.error('Error sending response:', err);
            } else {
                console.log(`Sent response to ${rinfo.address}:${rinfo.port}`);
            }
        });
    }
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

// Start UDP server
udpServer.bind(DISCOVERY_PORT);
// --- End UDP Discovery Server Setup ---

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://AJ:veggie@veggiedata.gdafs7i.mongodb.net/?retryWrites=true&w=majority')
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    // List collections for improved logging
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
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
// Log the collection name
console.log('Collection name:', SensorData.collection.name);

// GET all sensor data
app.get('/api/sensor-data', async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 });
    console.log('📊 All data:', data);
    res.json(data);
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
    console.log('📦 Data saved to collection:', SensorData.collection.name);
    console.log('📦 Data saved:', newData);
    console.log('📦 Document ID:', newData._id);
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (err) {
    console.error('❌ Error saving data:', err);
    console.error('❌ Error details:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server (listen on all interfaces, log server IP)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
  console.log(`🌐 Access via your IP: http://${serverIP}:${PORT}/api/sensor-data`);
  console.log(`🌐 Server IP: ${serverIP}`);
});
