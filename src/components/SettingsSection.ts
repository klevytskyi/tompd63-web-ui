import {
  setCurrentLeakageProtection,
  setProtectionTiming,
  setRecoveryTiming,
  setVCProtection,
} from "../messages";
import { type Protection, type Store, store } from "../store";
import { debounce } from "../utils";
import { PrepaymentSettings } from "./PrepaymentSettings";
import { ProtectionSetting } from "./ProtectionSetting";
import { TimingSetting } from "./TimingSetting";

export const SettingsSection = () => {
  // Toggle settings visibility
  const settingsContainer = document.querySelector(
    "#settings .settings-container"
  );
  const toggleButton = document.querySelector("#settings button");

  toggleButton?.addEventListener("click", () => {
    settingsContainer?.classList.toggle("hidden");
    if (toggleButton) {
      toggleButton.textContent = settingsContainer?.classList.contains("hidden")
        ? "open"
        : "close";
    }
  });

  const reactionTimeEl = document.querySelector("#reaction-time");
  const cooldownTimeEl = document.querySelector("#cooldown-time");
  const overvoltageEl = document.querySelector("#overvoltage-protection");
  const undervoltageEl = document.querySelector("#undervoltage-protection");
  const overcurrentEl = document.querySelector("#overcurrent-protection");
  const leakageEl = document.querySelector("#leakage-protection");

  if (
    !reactionTimeEl ||
    !cooldownTimeEl ||
    !overvoltageEl ||
    !undervoltageEl ||
    !overcurrentEl ||
    !leakageEl
  ) {
    return;
  }

  TimingSetting({
    element: reactionTimeEl,
    selector: (s) => s.reactionTime,
    onChange: debounce((e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      setProtectionTiming(+value);
    }, 500),
  });
  TimingSetting({
    element: cooldownTimeEl,
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
    element: overvoltageEl,
    selector: (s) => s.vcProtection.overvoltage,
    onToggle: (enabled: boolean) => {
      updateProtection("overvoltage", { enabled });
    },
    onChangeThreshold: debounce((threshold: number) => {
      updateProtection("overvoltage", { threshold });
    }, 500),
  });
  ProtectionSetting({
    element: undervoltageEl,
    selector: (s) => s.vcProtection.undervoltage,
    onToggle: (enabled: boolean) => {
      updateProtection("undervoltage", { enabled });
    },
    onChangeThreshold: debounce((threshold: number) => {
      updateProtection("undervoltage", { threshold });
    }, 500),
  });
  ProtectionSetting({
    element: overcurrentEl,
    selector: (s) => s.vcProtection.current,
    onToggle: (enabled: boolean) => {
      updateProtection("current", { enabled });
    },
    onChangeThreshold: debounce((threshold: number) => {
      updateProtection("current", { threshold });
    }, 500),
  });
  ProtectionSetting({
    element: leakageEl,
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
};
