import { DeviceStatusResponse, DpListResponse } from "./types";
import { bytesToString } from "./utils";

let baseURL = import.meta.env.DEV ? "http://192.168.0.178" : "";

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
