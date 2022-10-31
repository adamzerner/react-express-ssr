import { useState } from "react";

export default () => {
  const [count, setCount] = useState(1);

  return (
    <div>
      <div>Home</div>
      <div>{count}</div>
      <button onClick={() => setCount((c) => c + 1)}>increase</button>
    </div>
  );
};
