#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiManager.h>
#include <EEPROM.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>

#define EEPROM_SIZE 100
#define DISCOVERY_PORT 8266  // Port for server discovery
#define MAX_RETRIES 3        // Maximum number of discovery attempts

// Pins and Sensors
#include <DHT.h>
#define DHTPIN 4
#define DHTTYPE DHT11
#define MQ_PIN A0

DHT dht(DHTPIN, DHTTYPE);

// Variables
String serverUrl;
const int NUM_READINGS = 5;  // Number of readings to average
float humidityReadings[NUM_READINGS];
float tempReadings[NUM_READINGS];
int gasReadings[NUM_READINGS];
int readingIndex = 0;
int baselineReading = 0;  // Store baseline reading

WiFiUDP udp;

// Function to discover server
String discoverServer() {
  Serial.println("🔍 Searching for server...");
  
  for(int attempt = 0; attempt < MAX_RETRIES; attempt++) {
    Serial.print("Attempt ");
    Serial.print(attempt + 1);
    Serial.print(" of ");
    Serial.println(MAX_RETRIES);
    
    // Send broadcast packet
    udp.begin(DISCOVERY_PORT);
    udp.beginPacket("255.255.255.255", DISCOVERY_PORT);
    udp.write("SPOILALERT_DISCOVER");
    udp.endPacket();
    
    // Wait for response
    unsigned long startTime = millis();
    while (millis() - startTime < 3000) { // 3 second timeout per attempt
      int packetSize = udp.parsePacket();
      if (packetSize) {
        char incomingPacket[255];
        int len = udp.read(incomingPacket, 255);
        if (len > 0) {
          incomingPacket[len] = 0;
          String response = String(incomingPacket);
          if (response.startsWith("SPOILALERT_SERVER:")) {
            String serverInfo = response.substring(18); // Remove "SPOILALERT_SERVER:"
            Serial.print("✅ Server found: ");
            Serial.println(serverInfo);
            return "http://" + serverInfo;
          }
        }
      }
      delay(100);
    }
    Serial.println("No response, retrying...");
    delay(1000); // Wait before next attempt
  }
  
  Serial.println("❌ Server not found after all attempts");
  return "";
}

void setup() {
  Serial.begin(115200);
  EEPROM.begin(EEPROM_SIZE);
  dht.begin();
  
  // Initialize arrays
  for(int i = 0; i < NUM_READINGS; i++) {
    humidityReadings[i] = 0;
    tempReadings[i] = 0;
    gasReadings[i] = 0;
  }

  // Take initial gas sensor baseline reading
  baselineReading = 0;
  for(int i = 0; i < 10; i++) {
    baselineReading += analogRead(MQ_PIN);
    delay(100);
  }
  baselineReading /= 10;
  Serial.print("Baseline gas reading: ");
  Serial.println(baselineReading);

  WiFiManager wifiManager;
  
  // Set config portal timeout
  wifiManager.setConfigPortalTimeout(180); // 3 minutes timeout
  
  // AutoConnect will use saved Wi-Fi credentials
  if (!wifiManager.autoConnect("NodeMCU-Setup")) {
    Serial.println("⚠️ Failed to connect. Restarting...");
    delay(3000);
    ESP.restart();
  }

  Serial.println("✅ Connected to WiFi");
  
  // Try to discover server
  serverUrl = discoverServer();
  if (serverUrl == "") {
    Serial.println("⚠️ Server not found, restarting...");
    delay(3000);
    ESP.restart();
  }
  
  Serial.print("🌐 Server URL: ");
  Serial.println(serverUrl);
}

float getAverage(float* arr, int size) {
  float sum = 0;
  for(int i = 0; i < size; i++) {
    sum += arr[i];
  }
  return sum / size;
}

float getAverage(int* arr, int size) {
  float sum = 0;
  for(int i = 0; i < size; i++) {
    sum += arr[i];
  }
  return sum / size;
}

// Return a list of vegetable names if readings are at or above the minimum fresh thresholds (no upper bounds)
// Only return an empty list if below all minimums (i.e., no vegetable present)
void determineVegetables(float h, float t, int co2, int eth, String* matches, int& count) {
  count = 0;
  // Carrot: Minimum fresh thresholds
  if (h >= 95 && t >= 0 && co2 >= 400 && eth >= 0) {
    matches[count++] = "Carrot";
  }
  // Okra: Minimum fresh thresholds
  if (h >= 90 && t >= 7 && co2 >= 400 && eth >= 0) {
    matches[count++] = "Okra";
  }
  // Lettuce: Minimum fresh thresholds
  if (h >= 95 && t >= 0 && co2 >= 400 && eth >= 0) {
    matches[count++] = "Lettuce";
  }
  // If no matches, add "None"
  if (count == 0) {
    matches[count++] = "None";
  }
}

void loop() {
  // Read sensors
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int gasReading = analogRead(MQ_PIN);
  
  // Store readings in arrays
  humidityReadings[readingIndex] = humidity;
  tempReadings[readingIndex] = temperature;
  gasReadings[readingIndex] = gasReading;
  readingIndex = (readingIndex + 1) % NUM_READINGS;
  
  // Calculate averages
  float avgHumidity = getAverage(humidityReadings, NUM_READINGS);
  float avgTemperature = getAverage(tempReadings, NUM_READINGS);
  float avgGasReading = getAverage(gasReadings, NUM_READINGS);
  
  // Calculate relative change from baseline
  float relativeChange = (avgGasReading - baselineReading) / (float)baselineReading;
  
  // Convert gas readings using non-linear mapping with baseline
  // CO2: 400-2000 ppm range (more realistic indoor range)
  int co2 = map(relativeChange * 100, 0, 100, 400, 2000);
  // Ethylene: 0-2 ppm range (more realistic range)
  int ethylene = map(relativeChange * 100, 0, 100, 0, 20) / 10;

  if (isnan(avgHumidity) || isnan(avgTemperature)) {
    Serial.println("❌ Sensor read failed");
    return;
  }

  // Get all matching vegetables
  String matches[3];
  int matchCount = 0;
  determineVegetables(avgHumidity, avgTemperature, co2, ethylene, matches, matchCount);
  for (int i = 0; i < matchCount; i++) {
    sendToServer(avgTemperature, avgHumidity, co2, ethylene, matches[i]);
  }
  delay(3000);
}

void sendToServer(float temperature, float humidity, int co2, int ethylene, String vegetable) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClient client;
  HTTPClient http;
  
  // Append /api/data to the server URL
  String fullUrl = serverUrl + "/api/data";
  http.begin(client, fullUrl);

  http.addHeader("Content-Type", "application/json");

  String jsonData = "{\"temperature\":" + String(temperature, 2) +
                    ",\"humidity\":" + String(humidity, 2) +
                    ",\"co2\":" + String(co2) +
                    ",\"ethylene\":" + String(ethylene) +
                    ",\"vegetable\":\"" + vegetable + "\"}";

  int responseCode = http.POST(jsonData);

  if (responseCode > 0) {
    Serial.print("📤 Data sent. Code: ");
    Serial.println(responseCode);
  } else {
    Serial.print("❌ Failed. Code: ");
    Serial.println(responseCode);
  }

  http.end();
}
