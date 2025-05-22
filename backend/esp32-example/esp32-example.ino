#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <BH1750.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API endpoint
const char* serverUrl = "http://192.168.1.36:5000/api/iot/sensor-data";

// Plant ID (should be configured for each SmartPot)
const int plantId = 1;

// Sensor pins
const int moistureSensorPin = 36;  // Analog pin for capacitive soil moisture sensor
const int npkSensorRxPin = 16;     // RX pin for NPK sensor (using software serial)
const int npkSensorTxPin = 17;     // TX pin for NPK sensor (using software serial)

// Create BH1750 light sensor instance
BH1750 lightSensor;

void setup() {
  Serial.begin(115200);
  
  // Initialize WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Initialize I2C for BH1750 light sensor
  Wire.begin();
  lightSensor.begin();
  
  // Initialize other sensors
  // Note: NPK sensor initialization would depend on the specific model
}

void loop() {
  // Read sensor data
  float moistureLevel = readMoistureSensor();
  float lightLevel = readLightSensor();
  
  // Read NPK values (these would be implemented based on your specific NPK sensor)
  float nitrogen = 50;    // Example value
  float phosphorus = 50;  // Example value
  float potassium = 50;   // Example value
  
  // Read temperature (if you have a temperature sensor)
  float temperature = 50; // Example value
  
  // Send data to server
  sendSensorData(moistureLevel, nitrogen, phosphorus, potassium, lightLevel, temperature);
  
  // Wait before next reading
  delay(300000); // 5 minutes
}

float readMoistureSensor() {
  // Read the capacitive soil moisture sensor
  int rawValue = analogRead(moistureSensorPin);
  
  // Convert to percentage (adjust min/max values based on your sensor)
  int dryValue = 3200;   // Value when sensor is in dry air
  int wetValue = 1400;   // Value when sensor is in water
  
  float moisturePercentage = map(rawValue, dryValue, wetValue, 0, 100);
  moisturePercentage = constrain(moisturePercentage, 0, 100);
  
  Serial.print("Moisture: ");
  Serial.print(moisturePercentage);
  Serial.println("%");
  
  return moisturePercentage;
}

float readLightSensor() {
  // Read the BH1750 light sensor
  float lux = lightSensor.readLightLevel();
  
  // Convert to percentage (assuming max is around 10000 lux for indoor plants)
  float lightPercentage = (lux / 10000.0) * 100.0;
  lightPercentage = constrain(lightPercentage, 0, 100);
  
  Serial.print("Light: ");
  Serial.print(lightPercentage);
  Serial.println("%");
  
  return lightPercentage;
}

void sendSensorData(float moisture, float nitrogen, float phosphorus, float potassium, float light, float temperature) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Start HTTP connection
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON document
    StaticJsonDocument<256> doc;
    doc["plantId"] = plantId;
    doc["moistureLevel"] = moisture;
    doc["npkNitrogen"] = nitrogen;
    doc["npkPhosphorus"] = phosphorus;
    doc["npkPotassium"] = potassium;
    doc["lightLevel"] = light;
    doc["temperature"] = temperature;
    
    // Serialize JSON to string
    String requestBody;
    serializeJson(doc, requestBody);
    
    // Send the request
    int httpResponseCode = http.POST(requestBody);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }
    
    // Free resources
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
    // Attempt to reconnect
    WiFi.begin(ssid, password);
  }
}
