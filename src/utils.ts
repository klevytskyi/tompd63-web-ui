import { FAULT_STATE_MESSAGES } from "./constants";

// Calculate check sum for the message we will send via UART and add to the end
export function withCheckSum(array: number[]): number[] {
  const cs = array.reduce((sum, e) => sum + e, 0) & 0xff;
  return [...array, cs];
}

export const getFaultMessages = (faultCode: number): string[] =>
  FAULT_STATE_MESSAGES.filter((_, index) => faultCode & (1 << index));

export function bytesToString(array: number[]): string {
  return array
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join("");
}

export function toBigEndian16(num: number): number[] {
  return [(num >> 8) & 0xff, num & 0xff];
}

export function toBigEndian32(num: number): number[] {
  return [
    (num >> 24) & 0xff,
    (num >> 16) & 0xff,
    (num >> 8) & 0xff,
    num & 0xff,
  ];
}

export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export const parseHex = (hex: string) => parseInt(hex, 16);

export const parseMeasurements = (data: string) => ({
  voltage: parseHex(data.slice(0, 4)) / 10, // V
  current: parseHex(data.slice(4, 10)) / 1000, // A
  power: parseHex(data.slice(10, 16)) / 1000, // kW
});
