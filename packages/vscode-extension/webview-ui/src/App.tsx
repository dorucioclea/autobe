import { useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Hello World</h1>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Click me
      </button>
      <p>Count: {count}</p>
    </div>
  );
};

export default App;
