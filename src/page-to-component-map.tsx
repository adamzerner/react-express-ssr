import Home from "./pages/home";
import About from "./pages/about";
import NotFound from "./pages/error/not-found";

export const pageToComponentMap = {
  home: <Home />,
  about: <About />,
  notFound: <NotFound />,
};
