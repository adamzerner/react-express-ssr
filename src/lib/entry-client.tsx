import ReactDOM from "react-dom/client";
import App from "../app";

// @ts-expect-error value is present, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes
const page = document.querySelectorAll("input[type=hidden]")[0].value;

ReactDOM.hydrateRoot(
  document.getElementById("app") as HTMLElement,
  <App page={page} />
);
