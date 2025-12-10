import "./style.css";
import { store } from "./store";
import { MainSwitch } from "./components/MainSwitch";
import { Telemetry } from "./components/Telemetry";
import { Errors } from "./components/Errors";
import { getStatus } from "./api";
import { SettingsSection } from "./components/SettingsSection";

(async function updateTitles() {
  const deviceStatus = await getStatus();
  const name = deviceStatus?.Status.FriendlyName[0] ?? "TOMZN Breaker";
  document.title = name;
  (document.querySelector("#device-name") as HTMLHeadingElement).innerText =
    name;
})();

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    store.startPolling();
  } else {
    store.stopPolling();
  }
});

store.startPolling();

MainSwitch();
Errors();
Telemetry();
SettingsSection();
