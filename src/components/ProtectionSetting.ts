import { type Store, store, useStore } from "../store";

export const ProtectionSetting = <
  T extends { enabled: boolean; threshold: number },
>(props: {
  element: Element;
  selector: (s: Store) => T;
  onToggle: (enabled: boolean) => void;
  onChangeThreshold: (value: number) => void;
}) => {
  let isDirty = false;
  let isTouched = false;

  const toggle = props.element.querySelector(
    "input[type=checkbox]",
  ) as HTMLInputElement;
  const thresholdInput = props.element.querySelector(
    "input[type=number]",
  ) as HTMLInputElement;

  const handleTouched = () => {
    isTouched = true;
  };
  const handleDirty = () => {
    isDirty = true;
  };

  toggle.addEventListener("click", handleTouched);
  toggle.addEventListener("click", handleTouched);
  toggle.addEventListener("change", handleDirty);
  toggle.addEventListener("change", (e) => {
    if (!(e.target as HTMLInputElement).reportValidity()) {
      return;
    }
    props.onToggle((e.target as HTMLInputElement).checked);
  });
  thresholdInput.addEventListener("input", handleTouched);
  thresholdInput.addEventListener("change", handleDirty);
  thresholdInput.addEventListener("change", (e) => {
    if (!(e.target as HTMLInputElement).reportValidity()) {
      return;
    }
    props.onChangeThreshold(parseInt((e.target as HTMLInputElement).value, 10));
  });

  function render() {
    const { threshold, enabled } = useStore(props.selector);
    if (isDirty || isTouched) {
      if (
        threshold.toString() === thresholdInput.value &&
        enabled === toggle.hasAttribute("checked")
      ) {
        isDirty = false;
        isTouched = false;
      }
      return;
    }
    if (enabled) {
      toggle.setAttribute("checked", "true");
      toggle.checked = true;
    } else {
      toggle.removeAttribute("checked");
      toggle.checked = false;
    }
    thresholdInput.disabled = !enabled;
    thresholdInput.value = threshold.toString();
  }
  store.subscribe(render);
};
