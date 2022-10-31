import Home from "./pages/home";

type Props = {
  page: string;
};

export default ({ page }: Props) => {
  const pageToComponentMap = {
    home: <Home />,
  };
  const mainContent = pageToComponentMap[page];

  return (
    <div>
      <>
        <div>navbar</div>
        {mainContent}
        <div>footer</div>
      </>
    </div>
  );
};
