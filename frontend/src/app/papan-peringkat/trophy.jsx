'use client';

import { useState } from "react";
import { useEffect } from "react";

const TrophyUmkm = ({ rank, className }) => {
  const [color, setColor] = useState('fill-white');

  useEffect(() => {
    if (rank === 1) setColor("fill-yellow-400");
    else if (rank === 2) setColor("fill-zinc-400");
    else if (rank === 3) setColor("fill-yellow-600");
  }, [rank]);

  return (
    <span className={`${color}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24" className={className}>
        <path fillRule="evenodd" d="M5.166 2.621v.858q-1.553.223-3.071.543a.75.75 0 0 0-.584.859a6.75 6.75 0 0 0 6.138 5.6a6.7 6.7 0 0 0 2.743 1.346A6.7 6.7 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75a2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.7 6.7 0 0 1-1.112-3.173a6.7 6.7 0 0 0 2.743-1.347a6.75 6.75 0 0 0 6.139-5.6a.75.75 0 0 0-.585-.858a47 47 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744a49 49 0 0 0-6.093-.377q-3.096.002-6.093.377a.75.75 0 0 0-.657.744m0 2.629c0 1.196.312 2.32.857 3.294A5.27 5.27 0 0 1 3.16 5.337a46 46 0 0 1 2.006-.343zm13.5 0v-.256q1.011.15 2.006.343a5.27 5.27 0 0 1-2.863 3.207a6.7 6.7 0 0 0 .857-3.294" clipRule="evenodd"></path>
      </svg>
    </span>
  );
}

export default TrophyUmkm;