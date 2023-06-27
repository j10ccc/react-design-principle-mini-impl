import { useState, useEffect, useMemo } from "mini-impl";

export function setupCounter(element: HTMLButtonElement) {
  const [count, setCount] = useState(0);

  element.addEventListener("click", () => setCount(count() + 1));

  useEffect(() => {
    element.innerHTML = `count is ${count()}`;
  });

  useMemo(() => {
    const res = count() * 2;
    console.log(res);
    return res;
  });

}
