import { topupEnergy } from "../messages";
import { store, useStore } from "../store";

const handleOnTopUpClick = () => {
  const input = prompt("Enter kWh to top up:") ?? "";
  const kWh = parseFloat(input);
  if (!Number.isNaN(kWh)) {
    topupEnergy(+kWh);
  } else {
    alert("Please enter a valid number");
  }
};

export const Telemetry = () => {
  const voltageEl = document.querySelector(
    "#voltage .telemetry-value"
  ) as HTMLElement;
  const currentEl = document.querySelector(
    "#current .telemetry-value"
  ) as HTMLElement;
  const powerEl = document.querySelector(
    "#power .telemetry-value"
  ) as HTMLElement;
  const leakageEl = document.querySelector(
    "#current-leakage .telemetry-value"
  ) as HTMLElement;
  const totalPowerEl = document.querySelector(
    "#total-energy .telemetry-value"
  ) as HTMLElement;
  const balanceRoot = document.querySelector("#energy-balance") as HTMLElement;
  const energyBalanceValue = balanceRoot.querySelector(
    ".telemetry-value"
  ) as HTMLElement;
  (document.querySelector("#top-up") as HTMLButtonElement).addEventListener(
    "click",
    handleOnTopUpClick
  );

  function render() {
    const state = useStore((s) => ({
      voltage: s.voltage,
      current: s.current,
      power: s.power,
      leakage: s.leakageCurrent,
      totalPower: s.totalPower,
      balance: s.leftKwhBalance,
      prepaymentEnabled: s.prepayment,
    }));

    voltageEl.innerText = state.voltage.toFixed(2);
    currentEl.innerText = state.current.toFixed(2);
    powerEl.innerText = state.power.toFixed();
    leakageEl.innerText = state.leakage.toFixed();
    totalPowerEl.innerText = state.totalPower.toFixed(
      state.totalPower > 1 ? 0 : 3
    );
    energyBalanceValue.innerText = state.balance.toFixed(2);
    if (state.prepaymentEnabled) {
      balanceRoot.classList.remove("hidden");
    } else {
      balanceRoot.classList.add("hidden");
    }
  }

  store.subscribe(render);
};
