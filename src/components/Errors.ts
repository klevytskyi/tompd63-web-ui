import { store, useStore } from "../store";

export const Errors = () => {
  const container = document.querySelector("#errors-area")!;

  function render() {
    const errors = useStore((s) => s.errors);

    container.innerHTML = errors
      .map(
        (err) => `
            <div class="device-status">
                ${err}
            </div>
            `
      )
      .join("\n");
  }
  store.subscribe(render);
};
