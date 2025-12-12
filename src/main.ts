import "./style.css";
import { getStatus } from "./api";
import { Errors } from "./components/Errors";
import { MainSwitch } from "./components/MainSwitch";
import { SettingsSection } from "./components/SettingsSection";
import { Telemetry } from "./components/Telemetry";
import { store } from "./store";

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
