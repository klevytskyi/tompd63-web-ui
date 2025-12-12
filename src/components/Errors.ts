import { store, useStore } from "../store";

export const Errors = () => {
  const container = document.querySelector("#errors-area");
  if (!container) return;

  function render() {
    const errors = useStore((s) => s.errors);
    if (!container) return;

    container.innerHTML = errors
      .map(
        (err) => `
            <div class="device-status">
                ${err}
            </div>
            `,
      )
      .join("\n");
  }
  store.subscribe(render);
};
