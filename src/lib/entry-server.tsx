import ReactDOMServer from "react-dom/server";
import App from "../app";

export function render(page: string) {
  return ReactDOMServer.renderToString(<App page={page} />);
}
