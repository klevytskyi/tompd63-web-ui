import "./style.css";
import { Protection, Store, store } from "./store";
import { MainSwitch } from "./components/MainSwitch";
import { Telemetry } from "./components/Telemetry";
import { TimingSetting } from "./components/TimingSetting";
import {
  setCurrentLeakageProtection,
  setProtectionTiming,
  setRecoveryTiming,
  setVCProtection,
} from "./messages";
import { debounce } from "./utils";
import { ProtectionSetting } from "./components/ProtectionSetting";
import { PrepaymentSettings } from "./components/PrepaymentSettings";
import { Errors } from "./components/Errors";
import { getStatus } from "./api";

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
Telemetry();
TimingSetting({
  element: document.querySelector("#reaction-time")!,
  selector: (s) => s.reactionTime,
  onChange: debounce((e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setProtectionTiming(+value);
  }, 500),
});
TimingSetting({
  element: document.querySelector("#cooldown-time")!,
  selector: (s) => s.recoveryTime,
  onChange: debounce((e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setRecoveryTiming(+value);
  }, 500),
});

const updateProtection = (
  key: keyof Store["vcProtection"],
  value: Partial<Protection>
) => {
  const vcp = store.getState().vcProtection;
  setVCProtection({
    ...vcp,
    [key]: {
      ...vcp[key],
      ...value,
    },
  });
};

ProtectionSetting({
  element: document.querySelector("#overvoltage-protection")!,
  selector: (s) => s.vcProtection.overvoltage,
  onToggle: (enabled: boolean) => {
    updateProtection("overvoltage", { enabled });
  },
  onChangeThreshold: debounce((threshold: number) => {
    updateProtection("overvoltage", { threshold });
  }, 500),
});
ProtectionSetting({
  element: document.querySelector("#undervoltage-protection")!,
  selector: (s) => s.vcProtection.undervoltage,
  onToggle: (enabled: boolean) => {
    updateProtection("undervoltage", { enabled });
  },
  onChangeThreshold: debounce((threshold: number) => {
    updateProtection("undervoltage", { threshold });
  }, 500),
});
ProtectionSetting({
  element: document.querySelector("#overcurrent-protection")!,
  selector: (s) => s.vcProtection.current,
  onToggle: (enabled: boolean) => {
    updateProtection("current", { enabled });
  },
  onChangeThreshold: debounce((threshold: number) => {
    updateProtection("current", { threshold });
  }, 500),
});
ProtectionSetting({
  element: document.querySelector("#leakage-protection")!,
  selector: (s) => s.currentLeakageProtection,
  onToggle: (enabled: boolean) => {
    const leackageProtection = store.getState().currentLeakageProtection;
    setCurrentLeakageProtection({
      ...leackageProtection,
      enabled,
    });
  },
  onChangeThreshold: debounce((threshold: number) => {
    const leackageProtection = store.getState().currentLeakageProtection;
    setCurrentLeakageProtection({
      ...leackageProtection,
      threshold,
    });
  }, 500),
});

PrepaymentSettings();
Errors();
