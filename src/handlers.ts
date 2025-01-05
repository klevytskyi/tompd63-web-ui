import {
  setProtectionTiming,
  setRecoveryTiming,
  toggleClearEnergy,
  togglePrepayment,
} from "./messages";
import { debounce } from "./utils";

export const handleReactionTimeChange = debounce((e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  setProtectionTiming(+value);
}, 500);

export const handleRecoveryTimeChange = debounce((e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  setRecoveryTiming(+value);
}, 500);

export const handleClearEnergyClick = () => {
  if (confirm("Are you sure you want to clear energy?")) {
    toggleClearEnergy();
  }
};

export const handlePrepaidChange = (e: Event) => {
  const enabled = (e.target as HTMLInputElement).checked;
  togglePrepayment(enabled);
};
