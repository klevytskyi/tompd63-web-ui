import { type Store, store, useStore } from "../store";

export const TimingSetting = (props: {
  element: Element;
  selector: (s: Store) => number;
  onChange: (e: Event) => void;
}) => {
  let isDirty = false;
  let isTouched = false;

  const input = props.element.querySelector("input");
  const output = props.element.querySelector("output");
  if (!input || !output) return;

  input.addEventListener("input", (e: Event) => {
    isTouched = true;
    output.innerText = (e.target as HTMLInputElement).value.toString();
  });

  input.addEventListener("change", () => {
    isDirty = true;
  });
  input.addEventListener("change", props.onChange);

  function render() {
    const value = useStore(props.selector);
    if (!input || !output) return;
    if (isDirty || isTouched) {
      if (value.toString() === input.value) {
        isDirty = false;
        isTouched = false;
      }
      return;
    }
    input.value = value.toString();
    output.innerText = value.toString();
  }
  store.subscribe(render);
};
