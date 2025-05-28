# spoil-alert-mobapp

This project consists of a NodeMCU-based sensor system that monitors environmental conditions affecting vegetable spoilage and sends the data to a MongoDB database through a Node.js server.

## Hardware Requirements

### Components
1. NodeMCU ESP8266 (ONLY CONNECTS TO 2.4ghz internet)
2. DHT11 Temperature and Humidity Sensor
3. MQ-135 Gas Sensor (for CO2 and Ethylene detection)
4. Cables
5. Breadboard
6. USB cable (Micro USB)

### Pin Connections
- DHT11 - NODEMCU
  - VCC → 3.3V
  - DATA → D2 (GPIO4)
  - GND → GND
- MQ-135
  - VCC → 3.3V
  - AOUT → A0
  - GND → GND

## Software Setup

### 1. Driver Installation
1. Download CH340 driver from [sparks.gogo.co.nz](https://sparks.gogo.co.nz/ch340.html)
2. Install the driver:
   - For Windows: Run the installer from the unzipped folder
   - For Mac: Follow the PDF instructions in the zip file (different for macOS versions)
   - For Linux: Usually built into the kernel, no installation needed
3. Connect NodeMCU to computer
    - If NodeMCU is not detected or has connection errors in Arduino IDE:
     1. Run CH34x_Install_Windows_v3_4.EXE
     2. Click "UNINSTALL"
     3. Click "INSTALL"
     4. reconnect nodemcu to port
4. Verify installation in Device Manager (should appear as COM port)

### 2. Arduino IDE Setup
1. Download and install [Arduino IDE](https://www.arduino.cc/en/software)
2. Open Arduino IDE
3. Go to File → Preferences
4. Add this URL to Additional Boards Manager URLs:
   ```
   http://arduino.esp8266.com/stable/package_esp8266com_index.json
   ```
5. Go to Tools → Board → Boards Manager
6. Search for "esp8266" and install "ESP8266 by ESP8266 Community"

### 3. Required Libraries
Install these libraries through Arduino IDE (Tools → Manage Libraries):
- ESP8266WiFi (by ESP8266 Community)
- ESP8266HTTPClient (by ESP8266 Community)
- WiFiManager (by tzapu)
- DHT sensor library (by Adafruit)

### 4. Server Setup
1. Install [Node.js](https://nodejs.org/) (LTS version)
2. Install [MongoDB](https://www.mongodb.com/try/download/community) OR go to the website and access the database there
3. Clone this repository
4. Navigate to project directory
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the server:
   ```bash
   node server.js
   ```

### 5. Arduino Code Setup
1. Open `nodemcu_spoilage_monitor.ino` in Arduino IDE
2. Select correct board:
   - Tools → Board → ESP8266 Boards → NodeMCU 1.0 (ESP-12E Module)
3. Select correct port:
   - Tools → Port → (your COM port)
4. Upload the code

## First-Time Setup
1. After uploading the code, the NodeMCU will create a WiFi access point named "NodeMCU-Setup"
2. Connect to this WiFi network
3. A configuration portal will open automatically
4. Enter your WiFi credentials
6. Save the configuration

## Operation
- The system will automatically:
  - Read temperature and humidity from DHT11
  - Read gas levels from MQ-135
  - Determine vegetable type based on sensor readings
  - Send data to the server every 3 seconds
  - Store data in MongoDB database

## Troubleshooting
1. If NodeMCU doesn't connect to WiFi:
   - Press and hold the reset button for 5 seconds
   - The configuration portal will open again
2. If sensor readings are incorrect:
   - Check all connections
   - Verify power supply
   - Check sensor placement
3. If data isn't being sent to server:
   - Verify server is running
   - Check WiFi connection
   - Verify server URL in configuration
4. If Arduino IDE cannot detect NodeMCU:
   - Reinstall CH340 driver:
     1. Run CH34x_Install_Windows_v3_4.EXE
     2. Click "UNINSTALL"
     3. Click "INSTALL"
     4. Restart your computer
   - Check USB cable (try a different cable)
   - Try a different USB port
   - Verify the correct COM port is selected in Arduino IDE

## Testing Guide

### 1. Initial Testing
1. After setting up the hardware and software:
   - Power on the NodeMCU
   - Wait for the "NodeMCU-Setup" WiFi network to appear
   - Connect to the network and configure your WiFi
   - The device should automatically connect to your WiFi and discover the server

### 2. Sensor Testing
1. Temperature and Humidity (DHT11):
   - Place the sensor in a known environment (e.g., room temperature)
   - Verify readings match expected values:
     - Room temperature: 20-25°C
     - Normal humidity: 30-60%
   - If readings are off, check connections and sensor placement

2. Gas Sensor (MQ-135):
   - Initial readings should be around 400-500 ppm for CO2
   - Place near a vegetable to see changes in readings
   - Baseline reading is taken during startup
   - Relative changes from baseline indicate gas levels

### 3. Server Testing
1. Verify server is running:
   ```bash
   node server.js
   ```
2. Check data reception:
   - Open browser and navigate to: `http://localhost:3000/api/sensor-data`
   - Should see JSON data with temperature, humidity, CO2, ethylene, and vegetable type
3. Monitor server console for:
   - Connection logs
   - Data reception confirmations
   - Any error messages

### 4. Data Interpretation
The system determines vegetable type based on these thresholds:
- Carrot: Humidity ≥ 95%, Temperature ≥ 0°C, CO2 ≥ 400ppm
- Okra: Humidity ≥ 90%, Temperature ≥ 7°C, CO2 ≥ 400ppm
- Lettuce: Humidity ≥ 95%, Temperature ≥ 0°C, CO2 ≥ 400ppm

### 5. Common Test Scenarios
1. Fresh Vegetable Detection:
   - Place a fresh vegetable near sensors
   - Verify correct vegetable type is identified
   - Check readings are within expected ranges

2. Spoilage Detection:
   - Monitor readings over time
   - Look for changes in:
     - CO2 levels (increasing)
     - Ethylene levels (increasing)
     - Temperature (should remain stable)
     - Humidity (should remain stable)

3. Network Testing:
   - Test WiFi reconnection after power loss
   - Verify server discovery works
   - Check data transmission reliability

## Advanced Troubleshooting

### 1. Sensor Calibration
If sensor readings are consistently off:
1. DHT11:
   - Ensure sensor is not exposed to direct sunlight
   - Check for proper ventilation
   - Verify power supply stability

2. MQ-135:
   - Allow 24-48 hours for initial stabilization
   - Keep sensor away from direct airflow
   - Regular baseline recalibration may be needed

### 2. Network Issues
1. If NodeMCU fails to connect:
   - Check WiFi signal strength
   - Verify 2.4GHz network (5GHz not supported)
   - Ensure correct credentials

2. If server discovery fails:
   - Verify server is running
   - Check firewall settings
   - Ensure both devices are on same network

### 3. Data Transmission Issues
1. If data isn't being saved:
   - Check MongoDB connection
   - Verify server logs
   - Check network connectivity

2. If readings are erratic:
   - Check power supply stability
   - Verify sensor connections
   - Look for electromagnetic interference

## Dependencies and Installation

### 1. Required Software
1. Node.js (LTS version)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. MongoDB
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud version)
   - Verify installation:
     ```bash
     mongod --version
     ```

3. Arduino IDE
   - Download from [arduino.cc](https://www.arduino.cc/en/software)
   - Version 1.8.x or later recommended

### 2. Server Dependencies
Navigate to the server directory and run:
```bash
cd server
npm install express
npm install mongoose
npm install body-parser
npm install cors
```

### 3. Arduino Libraries
Install these libraries through Arduino IDE (Tools → Manage Libraries):
1. ESP8266WiFi (by ESP8266 Community)
2. ESP8266HTTPClient (by ESP8266 Community)
3. WiFiManager (by tzapu)
4. DHT sensor library (by Adafruit)
5. ESP8266mDNS
6. WiFiUdp

### 4. Version Requirements
- Node.js: v14.x or later
- npm: v6.x or later
- MongoDB: v4.x or later
- Arduino IDE: v1.8.x or later

Note: Make sure to run `npm install` in the server directory to install all dependencies listed in package.json.

## IP Address Configuration

### Server IP Address
The server automatically detects and uses your local IP address. You can verify the correct IP address by:

1. Running the server:
   ```bash
   node server.js
   ```
2. Looking for these lines in the console output:
   ```
   🌐 Access via your IP: http://YOUR_IP:3000/api/sensor-data
   🌐 Server IP: YOUR_IP
   ```

### NodeMCU Configuration
The NodeMCU automatically discovers the server's IP address using UDP broadcast. No manual IP configuration is needed. The process works as follows:

1. When the NodeMCU starts, it:
   - Connects to WiFi
   - Broadcasts a discovery message
   - Receives the server's IP address
   - Automatically configures itself to use the correct server URL

2. If you need to change the server's IP address:
   - The NodeMCU will automatically detect the new IP on next restart
   - No code changes are needed in the Arduino sketch

### Testing the Connection
1. Start the server first
2. Power on the NodeMCU
3. Check the Serial Monitor (115200 baud) to see:
   ```
   ✅ Connected to WiFi
   🔍 Searching for server...
   ✅ Server found: YOUR_IP:3000
   ```

If the NodeMCU fails to find the server, it will automatically retry up to 3 times before restarting.

## Mobile App Configuration

### IP Address Setup
1. Open `src/pages/FridgeScreen.tsx`
2. Locate the fetch call (around line 100):
   ```javascript
   const response = await fetch('http://192.168.1.2:3000/api/sensor-data', {
   ```
3. Replace `192.168.1.2` with your server's IP address
4. Save the file and rebuild the app

Note: The IP address must match the one shown in your server console when you start the server. You can find this by looking for the line:
```
🌐 Access via your IP: http://YOUR_IP:3000/api/sensor-data
```
