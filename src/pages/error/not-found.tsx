import { useState } from "react";

export default () => {
  const [count, setCount] = useState(1);

  return (
    <div>
      <div>404 Not Found</div>
      <div>{count}</div>
      <button onClick={() => setCount((c) => c + 3)}>increase</button>
    </div>
  );
};
