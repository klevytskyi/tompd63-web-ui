import { getDps } from "./api";
import type { DpEntry } from "./types";
import { getFaultMessages, parseMeasurements } from "./utils";

// DpIDs
const DPIDS = {
  total_energy: 1,
  measurements: 6,
  fault: 9,
  prepayment: 11,
  clear_counters: 12,
  prep_energy: 13,
  purch_energy: 14,
  lcurr: 15,
  relay: 16,
  lcurr_prot: 17,
  oth_prot: 18,
  breaker_id: 19,
  reaction_time: 104,
  recovery_time: 105,
};

// State types
export type Protection = {
  enabled: boolean;
  threshold: number;
};

export type Store = {
  id: string;
  currentLeakageProtection: Protection;
  vcProtection: {
    current: Protection;
    overvoltage: Protection;
    undervoltage: Protection;
  };
  switch: boolean;
  prepayment: boolean;
  reactionTime: number;
  recoveryTime: number;
  voltage: number;
  current: number;
  power: number;
  totalPower: number;
  leakageCurrent: number;
  leftKwhBalance: number;
  errors: string[];
  isPolling: boolean;
  errorsCount: number;
  offline: boolean;
};

// Create reactive store
let subscribers: Array<() => void> = [];
let state: Store = {
  id: "?",
  switch: false,
  prepayment: false,
  currentLeakageProtection: {
    enabled: false,
    threshold: 30,
  },
  vcProtection: {
    current: {
      enabled: false,
      threshold: 63,
    },
    overvoltage: {
      enabled: false,
      threshold: 250,
    },
    undervoltage: {
      enabled: false,
      threshold: 180,
    },
  },
  reactionTime: 10,
  recoveryTime: 20,
  voltage: 0,
  current: 0,
  power: 0,
  totalPower: 0,
  leakageCurrent: 0,
  leftKwhBalance: 0,
  errors: [],
  isPolling: false,
  errorsCount: 0,
  offline: false,
};

export const store = {
  subscribe(callback: () => void) {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter((cb) => cb !== callback);
    };
  },

  getState(): Store {
    return state;
  },

  setState(newState: Partial<Store>) {
    state = { ...state, ...newState };
    subscribers.forEach((callback) => {
      callback();
    });
  },

  // Polling
  startPolling(interval = 1000) {
    if (state.errorsCount > 5) {
      state.offline = true;
    }
    if (state.isPolling) return;

    state.isPolling = true;
    const poll = async () => {
      if (!state.isPolling) return;

      try {
        const dps = await getDps();
        if (!dps) return;

        this.updateFromDps(dps);
        if (state.errorsCount > 0) {
          state.errorsCount -= 1;
        }
      } catch (_err) {
        state.errorsCount += 1;
      } finally {
        setTimeout(poll, interval);
      }
    };

    poll();
  },

  stopPolling() {
    state.isPolling = false;
  },

  // Update state from DPs
  updateFromDps(dps: DpEntry[]) {
    const newState: Partial<Store> = {};

    dps.forEach((dp) => {
      switch (dp.id) {
        case DPIDS.total_energy:
          newState.totalPower = (dp.data as number) / 1000; // kWh
          break;
        case DPIDS.measurements: {
          const { voltage, current, power } = parseMeasurements(
            dp.data as string,
          );
          newState.voltage = voltage;
          newState.current = current;
          newState.power = power;
          break;
        }
        case DPIDS.lcurr:
          newState.leakageCurrent = dp.data as number; // mA
          break;
        case DPIDS.fault:
          newState.errors = getFaultMessages(parseInt(dp.data as string, 16));
          break;
        case DPIDS.prep_energy:
          newState.leftKwhBalance = (dp.data as number) / 100; // kWh
          break;
        case DPIDS.relay:
          newState.switch = Boolean(dp.data);
          break;
        case DPIDS.prepayment:
          newState.prepayment = Boolean(dp.data);
          break;
        case DPIDS.breaker_id:
          newState.id = dp.data as string;
          break;
        case DPIDS.lcurr_prot: {
          const lcurrprot = dp.data as number;
          newState.currentLeakageProtection = {
            enabled: Boolean((lcurrprot >> 16) & 0xff),
            threshold: lcurrprot & 0xffff,
          };
          break;
        }
        case DPIDS.oth_prot: {
          const othprot = dp.data as string;
          newState.vcProtection = {
            current: {
              enabled: Boolean(parseInt(othprot.slice(0, 2), 16)),
              threshold: parseInt(othprot.slice(4, 8), 16),
            },
            overvoltage: {
              enabled: Boolean(parseInt(othprot.slice(8, 10), 16)),
              threshold: parseInt(othprot.slice(12, 16), 16),
            },
            undervoltage: {
              enabled: Boolean(parseInt(othprot.slice(16, 18), 16)),
              threshold: parseInt(othprot.slice(20, 24), 16),
            },
          };
          break;
        }
        case DPIDS.reaction_time:
          newState.reactionTime = dp.data as number;
          break;
        case DPIDS.recovery_time:
          newState.recoveryTime = dp.data as number;
          break;
      }
    });
    this.setState(newState);
  },
};

export function useStore<T>(selector: (state: Store) => T): T {
  const value = selector(state);

  return value;
}
