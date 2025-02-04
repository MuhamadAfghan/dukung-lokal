"use client";
import { useState, useEffect } from "react";

const Medal = ({ rank, className }) => {
  const [color, setColor] = useState("text-black");

  useEffect(() => {
    if (rank <= 5) setColor("text-yellow-400");
    else if (rank <= 15) setColor("text-zinc-400");
    else setColor("text-yellow-600");
  }, [rank]);

  return (
    <span className={color}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={48}
        height={48}
        viewBox="0 0 24 24"
        className={className}
      >
        <path
          fill="currentColor"
          d="M12 7a8 8 0 1 1 0 16a8 8 0 0 1 0-16m0 2a6 6 0 1 0 0 12a6 6 0 0 0 0-12m0 1.5l1.322 2.68l2.958.43l-2.14 2.085l.505 2.946L12 17.25l-2.645 1.39l.505-2.945l-2.14-2.086l2.958-.43zM18 2v3l-1.363 1.138A9.9 9.9 0 0 0 13 5.049V2zm-7-.001v3.05a9.9 9.9 0 0 0-3.636 1.088L6 5V2z"
        ></path>
      </svg>
    </span>
  );
};

export default Medal;
