import { toggleClearEnergy, togglePrepayment } from "../messages";
import { store, useStore } from "../store";

export const PrepaymentSettings = () => {
  let isDirty = false;

  const container = document.querySelector(
    "#expence-management"
  ) as HTMLElement;
  const toggle = container.querySelector(
    "input[type=checkbox]"
  ) as HTMLInputElement;
  const button = container.querySelector("button") as HTMLButtonElement;

  const handleDirty = () => {
    isDirty = true;
  };

  toggle.addEventListener("click", handleDirty);
  toggle.addEventListener("change", (e) => {
    if (!(e.target as HTMLInputElement).reportValidity()) {
      return;
    }
    togglePrepayment((e.target as HTMLInputElement).checked);
  });
  button.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear energy?")) {
      toggleClearEnergy();
    }
  });

  function render() {
    const enabled = useStore((s) => s.prepayment);
    if (isDirty) {
      if (enabled === toggle.hasAttribute("checked")) {
        isDirty = false;
      }
      return;
    }
    if (enabled) {
      toggle.setAttribute("checked", "true");
    } else {
      toggle.removeAttribute("checked");
    }
  }
  store.subscribe(render);
};
