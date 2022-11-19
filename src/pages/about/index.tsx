import { useState } from "react";

export default () => {
  const [count, setCount] = useState(1);

  return (
    <div>
      <div>About</div>
      <div>{count}</div>
      <button onClick={() => setCount((c) => c + 2)}>increase</button>
    </div>
  );
};
