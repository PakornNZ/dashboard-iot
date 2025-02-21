#include <HTTPClient.h>
// #include <WiFiClientSecure.h>
#include <WiFiManager.h>
#include <WiFi.h>
#include "DHT.h"
#include <ArduinoJson.h>
#include <Adafruit_SH110X.h>  
#include <EEPROM.h>

Adafruit_SH1106G display = Adafruit_SH1106G(128, 64, &Wire);

unsigned long lastTime = 0;
unsigned long lastNoti = 0;
unsigned long timeDelay = 5000;
unsigned long NotiDelay = 300;
float temp, humidity, ldr, ldr_d, flow;
bool statusDHT, statusRL, statusLDR, statusWT, statusFlow, statusPH;
bool statusReset = false;
bool statusNotic, statusNotic_d;
bool led1, led2;

#define SW_Reset 27
#define SW_Noti 18
#define relayPin 12
#define ldrPIN 36
#define ldrPIN_DI 26
#define pH_Pin 34
#define water 35
#define DHTPIN 14 
#define DHTTYPE DHT22
int ledPin[] = {2, 4, 5};
int valueFan = 30;
float pHValue;

#define API_IP "http://172.25.11.118"
#define API_PATH_LED "/API/APISensor/fetchSensor.php"
#define API_PATH_INSERT "/API/APISensor/insertData.php"
#define API_NOTI "/API/notification.php"
#define API_LED "/API/APISensor/insertLED.php"

String APILED = String(API_IP) + String(API_PATH_LED);
String APIINSERT = String(API_IP) + String(API_PATH_INSERT);
String APINOTI = String(API_IP) + String(API_NOTI);
String APILED_IN = String(API_IP) + String(API_LED);

// WiFiClientSecure client;
WiFiManager WM;
DHT dht(DHTPIN, DHTTYPE);


void IRAM_ATTR resetWifi() {
  statusReset = true;
}

void IRAM_ATTR setNoti() {
  if (millis() - lastNoti > NotiDelay) {
    lastNoti = millis();
    statusNotic = !statusNotic;
    digitalWrite(ledPin[2], !statusNotic);
  }
}

void setup() {
  Serial.begin(115200);
  EEPROM.begin(2);

  for (int i : ledPin) pinMode(i, OUTPUT);
  pinMode(SW_Reset, INPUT_PULLUP);
  pinMode(SW_Noti, INPUT_PULLUP);
  pinMode(water, INPUT);
  pinMode(ldrPIN_DI, INPUT);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW);

  statusNotic = EEPROM.readBool(0);
  statusNotic_d = statusNotic;
  digitalWrite(ledPin[2], !statusNotic);
  
  attachInterrupt(SW_Reset, resetWifi, FALLING);
  attachInterrupt(SW_Noti, setNoti, FALLING);

  Wire.begin(21, 22);
  if (!display.begin(0x3C)) {
    Serial.println("OLED not found");
    delay(5000);
    ESP.restart();
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);

  WM.setConfigPortalTimeout(180);
  WM.setAPCallback(configModeCallback);
  if (!WM.autoConnect("NAF_IOT", "00000000")) {
    display.setCursor(0, 0);
    display.println("Failed to connect & timeout");
    display.display();
    delay(2000);
    ESP.restart();
  } 
 
  if (WiFi.status() != WL_CONNECTED) {
    display.setCursor(0, 0);
    display.println("Failed to connect, restarting...");
    display.display();
    Serial.println("Failed to connect, restarting...");
    delay(5000);
    ESP.restart();
  } else {
    display.clearDisplay();
    display.setCursor(23, 22);
    display.println("Connected WiFi");
    display.setCursor(35, 32);
    display.println("Complete.");
    display.display();
    delay(5000);
  }
  display.clearDisplay();

  dht.begin();
  // client.setInsecure();
  
  insert_Data();
  sensor_Contral();
}

void configModeCallback (WiFiManager *WM) {
  display.setCursor(0, 0);
  display.println("Please connect to ");

  display.setCursor(0, 12);
  display.print("WiFi : ");
  display.println(WM->getConfigPortalSSID());

  display.setCursor(0, 22);
  display.println("Password : 00000000");

  display.setCursor(0, 42);
  display.print("IP : ");
  display.println(WiFi.softAPIP());
  display.display();
}

void loop() {

  if (statusReset) {
    reset_wifimanager();
  }

  if (millis() - lastTime > timeDelay) {
    lastTime = millis();
    temp = dht.readTemperature();
    humidity = dht.readHumidity();
    ldr = analogRead(ldrPIN);
    ldr_d = digitalRead(ldrPIN_DI);
    ldr = 4096 - ldr;

    if (ldr == 4096 && ldr_d == 0) {
      statusLDR = false;
      ldr = 0;
    } else {
      statusLDR = true;
    }

    // uint32_t pulse = pulseIn(water, HIGH, 1000000);
    int VR = analogRead(water);
    uint32_t pulse = map(VR, 0, 4095, 200000, 20000);

    if (VR < 1) {
      statusWT = false;
      flow = 0;
    } else {
      statusWT = true;
      float Hz = 1000000.0 / pulse;
      flow = (Hz / 7.5);

      if (flow > 2.5) {
        statusFlow = true;
      } else {
        statusFlow = false;
      }
    }

    statusDHT = isnan(temp) || isnan(humidity) ? false : true;
    if (statusDHT) {
      statusRL = temp > valueFan ? true : false;
      digitalWrite(relayPin, statusRL);
    }

    int adcValue = analogRead(pH_Pin);
    float voltage = (adcValue / 4095.0) * 3.3;
    pHValue = (voltage / 3.3) * 14.0;

    if (pHValue < 1) {
      statusPH = false;
    } else {
      statusPH = true;
    }

    display.clearDisplay();
    display.setCursor(0, 0);
    display.print("Temp: ");
    display.print(temp);
    display.println(" C");

    display.setCursor(0, 12);
    display.print("Humi: ");
    display.print(humidity);
    display.println(" %");

    display.setCursor(0, 22);
    display.print("Light: ");
    display.print(ldr);
    display.println(" Lux");

    display.setCursor(0, 32);
    display.print("Water: ");
    display.print(flow);
    display.println(" L/min");

    display.setCursor(0, 42);
    display.print("pH: ");
    display.println(pHValue);

    display.setCursor(0, 52);
    display.print("Active Temp: ");
    display.print(valueFan);
    display.println(" C");

    display.display();

    insert_Data();
    sensor_Contral();

    if (statusNotic)
      notification();
    if (statusNotic != statusNotic_d) {
      statusNotic_d = statusNotic;
      EEPROM.writeBool(0, statusNotic);
      EEPROM.commit();
    }

    if (led1 || led2) {
      digitalWrite(ledPin[0], led1);
      digitalWrite(ledPin[1], led2);
    } else {
      if (ldr < 50) {
        digitalWrite(ledPin[0], HIGH);
        digitalWrite(ledPin[1], HIGH);
        insertLED(true);
      } else {
        digitalWrite(ledPin[0], LOW);
        digitalWrite(ledPin[1], LOW);
        insertLED(false);
      }
    }
  }
}

void insertLED(bool state) {
  HTTPClient https;
  https.begin(APILED_IN);
  https.addHeader("Content-Type", "application/json");
  DynamicJsonDocument doc(1024); 

  doc["state"] = state;
  char buffer[1024];
  size_t len = serializeJson(doc, buffer);

  if(len > 0) {
    int httpResponseCode = https.POST(buffer);
    if (httpResponseCode > 0) {
        Serial.println("Complete Insert LED.");
    } else {
      Serial.println("Failed to send LED");
    }
  }
  https.end();
}

void insert_Data(){
  HTTPClient https;
  https.begin(APIINSERT);
  https.addHeader("Content-Type", "application/json");

  DynamicJsonDocument doc(1024); 
  if (!statusDHT) {
    doc["hum"].set(nullptr);
    doc["temp"].set(nullptr);
  } else { 
    doc["temp"] = temp;
    doc["hum"] = humidity;
  }
  if (!statusLDR)
    doc["light"].set(nullptr);
  else
    doc["light"] = ldr;
  if (!statusWT)
    doc["flow"].set(nullptr);
  else
    doc["flow"] = flow;
  if (!statusPH)
    doc["pH"].set(nullptr);
  else
    doc["pH"] = pHValue;

  doc["statusDHT"] = statusDHT;
  doc["statusRL"] = statusRL;
  doc["statusLDR"] = statusLDR;
  doc["statusWT"] = statusWT;
  doc["statusFlow"] = statusFlow;
  doc["statusPH"] = statusPH;
  char buffer[1024];
  size_t len = serializeJson(doc, buffer);

  if(len > 0) {
    int httpResponseCode = https.POST(buffer);
    if (httpResponseCode > 0) {
      Serial.println("Sensor Data Sent: " + String(buffer));
    } else {
      Serial.println("Failed to send data");
    }
  }
  https.end();
}

void sensor_Contral(){
  HTTPClient https;
  https.begin(APILED);
  int httpResponseCode = https.GET();

  if (httpResponseCode > 0) {
    String payload = https.getString();

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload);

    if (!error) {
      led1 = doc["led1"]["status"];
      led2 = doc["led2"]["status"];
      valueFan = doc["fan"]["value"];
    }
  } else {
      display.display();
  }
  https.end();
}


void notification() {
  HTTPClient https;
  https.begin(APINOTI);
  https.addHeader("Content-Type", "application/json");

  DynamicJsonDocument doc(1024);
  doc["dht"] = statusDHT;
  doc["ldr"] = statusLDR;
  doc["water"] = statusWT;
  doc["flow"] = statusFlow;
  doc["flow"] = statusFlow;
  doc["lit"] = flow;
  doc["ph"] = statusPH;
  doc["ph_v"] = pHValue;
  doc["temp"] = temp;

  char buffer[1024];
  size_t len = serializeJson(doc, buffer);

  if(len > 0) {
    int httpResponseCode = https.POST(buffer);
    if (httpResponseCode > 0) {
      Serial.println("Sensor Noti Sent: " + String(buffer));
    } else {
      Serial.println("Failed to notification.");
    }
  }
  https.end();
}

void reset_wifimanager(){
  display.clearDisplay();
  display.setCursor(30, 22);
  display.println("WiFi Reset?");
  display.setCursor(30, 32);
  display.println("waiting 5s.");
  display.display();

  Serial.println("WiFi Reset? Ple. waiting 5s.");
  delay(5000);
  if(digitalRead(SW_Reset) == LOW){
    delay(10);
    while(digitalRead(SW_Reset) == LOW){
      delay(10);
      WM.resetSettings();
    }
    display.clearDisplay();
    display.setCursor(5, 22);
    display.println("WiFi Reset Setting.");
    display.display();

    Serial.println("WiFi Resrt Setting .. OK");
    WM.resetSettings();  
  }
  ESP.restart();
}
