import {
  setProtectionTiming,
  setRecoveryTiming,
  setVCProtection,
  setCurrentLeakageProtection,
} from "../messages";
import { Store, Protection, store } from "../store";
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
};
