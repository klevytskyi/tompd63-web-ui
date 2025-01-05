import { toggleSwitch } from "../messages";
import { store, useStore } from "../store";

export const handleMainSwitchChange = (e: Event) => {
  const enabled = (e.target as HTMLInputElement).checked;
  toggleSwitch(enabled);
};

export const MainSwitch = () => {
  const switchEl = document.querySelector("#main-switch") as HTMLInputElement;
  switchEl.addEventListener("change", handleMainSwitchChange);

  function render() {
    const checked = useStore((state) => state.switch);

    switchEl.dataset.inited = "true";
    if (checked) {
      switchEl.setAttribute("checked", "true");
      switchEl.checked = true;
    } else {
      switchEl.removeAttribute("checked");
      switchEl.checked = false;
    }
  }
  store.subscribe(render);
};
