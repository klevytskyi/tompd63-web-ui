import { sendMsg } from "./api";
import { DpType } from "./constants";
import {
  toBigEndian16 as BigEndian16,
  toBigEndian32 as BigEndian32,
  withCheckSum,
} from "./utils";

/**
 * Message format:
 * '55 AA 00 06 00 05 10 01 00 01 01 1D' ON
 *    55 AA -- HEADER
 *    00 -- VERSION
 *    06 -- COMMAND (05 - Report, 06 - Command, 07 - Query)
 *    00 05 -- DATA LENGTH
 *    10 01 00 01 01 -- DP
 *          10 -- DPID in Hex
 *          01 -- Data type (0x00 - Raw (N bytes), 0x01 - Bool (1 byte), 0x02 - Value integer (4 bytes), 0x03 - String (N bytes), 0x04 - Enum (1 byte), 0x05 Bitmap - (1/2/4 bytes))
 *          00 01 -- Data length
 *          01 -- Value
 *    1D -- CHECKSUM
 */

const MSG_HEADER_BYTES = [0x55, 0xaa];
const VERSION = 0x00;
const COMMAND_CMD = 0x06;

const createMessage = (dpId: number, dataType: DpType, payload: number[]) =>
  withCheckSum([
    ...MSG_HEADER_BYTES,
    VERSION,
    COMMAND_CMD,
    ...BigEndian16(payload.length + 4),
    dpId,
    dataType,
    ...BigEndian16(payload.length),
    ...payload,
  ]);

const toggleButton = async (dpId: number, state: number = 1) => {
  return sendMsg(createMessage(dpId, DpType.BOOL, [state]));
};

export const toggleSwitch = (enabled: boolean) => toggleButton(16, +enabled);
export const togglePrepayment = (enabled: boolean) =>
  toggleButton(11, +enabled);
export const toggleClearEnergy = () => toggleButton(12);

type GenericProtectionOptions = {
  enabled: boolean;
  threshold: number;
};

/**
 * Creates payload for voltage/current protection settings (DpID 18).
 * Working format from TOMPD-63-WIFI_rev7.html:
 * - Current:      [0x01, enabled, 0x00, threshold_8bit]
 * - Overvoltage:  [0x03, enabled, threshold_high, threshold_low]
 * - Undervoltage: [0x04, enabled, threshold_high, threshold_low]
 *
 * Each protection has a fixed prefix byte (0x01, 0x03, 0x04) to identify the type.
 * Note: Current threshold is 8-bit, voltage thresholds are 16-bit big-endian.
 */
const createCurrentProtection = (opt: GenericProtectionOptions) => [
  0x01,
  +opt.enabled,
  0x00,
  opt.threshold & 0xff,
];

const createOvervoltageProtection = (opt: GenericProtectionOptions) => [
  0x03,
  +opt.enabled,
  ...BigEndian16(opt.threshold),
];

const createUndervoltageProtection = (opt: GenericProtectionOptions) => [
  0x04,
  +opt.enabled,
  ...BigEndian16(opt.threshold),
];

/**
 * Leakage current protection (DpID 17) uses a similar but separate format:
 * [0x04, enabled, threshold_high, threshold_low]
 */
export const setCurrentLeakageProtection = async (
  options: GenericProtectionOptions
) =>
  sendMsg(
    createMessage(17, DpType.RAW, [
      0x04,
      +options.enabled,
      ...BigEndian16(options.threshold),
    ])
  );

type VCProtectionOptions = {
  current: GenericProtectionOptions;
  overvoltage: GenericProtectionOptions;
  undervoltage: GenericProtectionOptions;
};

const createVCProtectionPayload = (options: VCProtectionOptions) => {
  return [
    ...createCurrentProtection(options.current),
    ...createOvervoltageProtection(options.overvoltage),
    ...createUndervoltageProtection(options.undervoltage),
  ];
};

export const setVCProtection = async (options: VCProtectionOptions) => {
  const payload = createVCProtectionPayload(options);
  const msg = createMessage(18, DpType.RAW, payload);
  return sendMsg(msg);
};

const setTiming = async (dp: number, value: number) => {
  const payload = BigEndian32(value);
  const msg = createMessage(dp, DpType.INT, payload);
  return sendMsg(msg);
};

export const setProtectionTiming = async (value: number) =>
  setTiming(104, value);

export const setRecoveryTiming = async (value: number) => setTiming(105, value);

export const topupEnergy = async (kWh: number) => {
  const value = kWh * 100;
  const payload = BigEndian32(value);
  const msg = createMessage(14, DpType.INT, payload);
  return sendMsg(msg);
};
