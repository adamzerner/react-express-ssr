import Home from "./pages/home";
import About from "./pages/about";
import NotFound from "./pages/error/not-found";

type Props = {
  page: string;
};

export default ({ page }: Props) => {
  const pageToComponentMap = {
    home: <Home />,
    about: <About />,
    notFound: <NotFound />,
  };
  const mainContent = pageToComponentMap[page];

  return (
    <div>
      <div>navbar</div>
      {mainContent}
      <div>footer</div>
    </div>
  );
};
