import ReactDOMServer from "react-dom/server";
import App from "./app";

export function render() {
  return ReactDOMServer.renderToString(<App />);
}
