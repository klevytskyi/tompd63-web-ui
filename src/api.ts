import type { DeviceStatusResponse, DpListResponse } from "./types";
import { bytesToString } from "./utils";

const baseURL = import.meta.env.VITE_DEVICE_BASE_URL || window.location.origin;

export async function getStatus() {
  try {
    const res = await fetch(`${baseURL}/cm?cmnd=status`);
    const data: DeviceStatusResponse = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getDps() {
  try {
    const res = await fetch(`${baseURL}/cm?cmnd=Dp`);
    const data: DpListResponse = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function sendMsg(msg: number[]) {
  try {
    fetch(`${baseURL}/cm?cmnd=uartSendHex ${bytesToString(msg)}`);
  } catch (err) {
    console.error(err);
  }
}
