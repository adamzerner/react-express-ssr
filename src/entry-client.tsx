import ReactDOM from "react-dom/client";
import App from "./app";

ReactDOM.hydrateRoot(
  document.getElementById("app") as HTMLElement,
  <App page="home" />
);
