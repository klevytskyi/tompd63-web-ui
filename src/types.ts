import type { DpType } from "./constants";

/** Basic device information and configuration */
export interface DeviceStatus {
  Module: number;
  DeviceName: string;
  FriendlyName: string[];
  Topic: string;
  ButtonTopic: string;
  Power: number;
  PowerOnState: number;
  LedState: number;
  LedMask: string;
  SaveData: number;
  SaveState: number;
  SwitchTopic: string;
  SwitchMode: number[];
  ButtonRetain: number;
  SwitchRetain: number;
  SensorRetain: number;
  PowerRetain: number;
  InfoRetain: number;
  StateRetain: number;
}

/** Device parameters and runtime configuration */
export interface DeviceParameters {
  Baudrate: number;
  SerialConfig: string;
  GroupTopic: string;
  OtaUrl: string;
  RestartReason: string;
  Uptime: number;
  StartupUTC: string;
  Sleep: number;
  CfgHolder: number;
  BootCount: number;
  BCResetTime: string;
  SaveCount: number;
  SaveAddress: string;
}

/** Firmware and hardware information */
export interface FirmwareStatus {
  Version: string;
  BuildDateTime: string;
  Boot: number;
  Core: string;
  SDK: string;
  CpuFrequency: number;
  Hardware: string;
  CR: string;
}

/** Logging configuration */
export interface LogStatus {
  SerialLog: number;
  WebLog: number;
  MqttLog: number;
  SysLog: number;
  LogHost: string;
  LogPort: number;
  SSId1: string;
  SSId2: string;
  TelePeriod: number;
  Resolution: string;
  SetOption: string[];
}

/** Memory and system resources status */
export interface MemoryStatus {
  ProgramSize: number;
  Free: number;
  Heap: number;
  ProgramFlashSize: number;
  FlashSize: number;
  FlashChipId: string;
  FlashFrequency: number;
  FlashMode: number;
  Features: string[];
  Drivers: string;
  Sensors: string;
}

/** Network configuration and status */
export interface NetworkStatus {
  Hostname: string;
  IPAddress: string;
  Gateway: string;
  Subnetmask: string;
  DNSServer1: string;
  DNSServer2: string;
  Mac: string;
  Webserver: number;
  HTTP_API: number;
  WifiConfig: number;
  WifiPower: number;
}

/** MQTT broker configuration */
export interface MqttStatus {
  MqttHost: string;
  MqttPort: number;
  MqttClientMask: string;
  MqttClient: string;
  MqttUser: string;
  MqttCount: number;
  MAX_PACKET_SIZE: number;
  KEEPALIVE: number;
  SOCKET_TIMEOUT: number;
}

/** Time and timezone settings */
export interface TimeStatus {
  UTC: string;
  Local: string;
  StartDST: string;
  EndDST: string;
  Timezone: string;
  Sunrise: string;
  Sunset: string;
}

/** Sensor data */
export interface SensorStatus {
  Time: string;
}

/** WiFi connection details */
export interface WifiStatus {
  AP: number;
  SSId: string;
  BSSId: string;
  Channel: number;
  Mode: string;
  RSSI: number;
  Signal: number;
  LinkCount: number;
  Downtime: string;
}

/** Current device state and statistics */
export interface DeviceStateStatus {
  Time: string;
  Uptime: string;
  UptimeSec: number;
  Heap: number;
  SleepMode: string;
  Sleep: number;
  LoadAvg: number;
  MqttCount: number;
  POWER1: string;
  POWER2: string;
  POWER3: string;
  Wifi: WifiStatus;
}

/** Main response interface combining all status components */
export interface DeviceStatusResponse {
  /** Basic device information and configuration */
  Status: DeviceStatus;
  /** Device parameters and runtime configuration */
  StatusPRM: DeviceParameters;
  /** Firmware and hardware information */
  StatusFWR: FirmwareStatus;
  /** Logging configuration */
  StatusLOG: LogStatus;
  /** Memory and system resources status */
  StatusMEM: MemoryStatus;
  /** Network configuration and status */
  StatusNET: NetworkStatus;
  /** MQTT broker configuration */
  StatusMQT: MqttStatus;
  /** Time and timezone settings */
  StatusTIM: TimeStatus;
  /** Sensor data */
  StatusSNS: SensorStatus;
  /** Current device state and statistics */
  StatusSTS: DeviceStateStatus;
}

export type DpEntry = {
  id: number;
  type: DpType;
  data: number | string;
};

export type DpListResponse = DpEntry[];
