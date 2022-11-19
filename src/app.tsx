import { pageToComponentMap } from "./page-to-component-map";

type Props = {
  page: string;
};

export default ({ page }: Props) => {
  const mainContent = pageToComponentMap[page];

  return (
    <div>
      <div>navbar</div>
      {mainContent}
      <div>footer</div>
    </div>
  );
};
