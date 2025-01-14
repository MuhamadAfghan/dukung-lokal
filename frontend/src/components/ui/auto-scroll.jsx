import { useState, useEffect, useRef } from 'react';


const AutoScroll = ({ className, children, AutoScrollHeight = null }) => {
  const [scroll, setScroll] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const userScrollTimeoutRef = useRef(null);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const scrollTable = () => {
      if (!scroll || isUserScrolling) return;

      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const currentScroll = scrollContainer.scrollTop;

      if (currentScroll >= maxScroll) {
        scrollContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        setScroll(false);
        setTimeout(() => setScroll(true), 3000);
      } else {
        scrollContainer.scrollTo({
          top: currentScroll + (AutoScrollHeight ?? containerRef.current.clientHeight),
          behavior: 'smooth'
        });
        console.log(containerRef.current.clientHeight);
      }
    };

    const handleUserScroll = () => {
      setIsUserScrolling(true);

      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }

      userScrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 150);
    };

    scrollContainer.addEventListener('wheel', handleUserScroll);
    scrollContainer.addEventListener('touchmove', handleUserScroll);

    const intervalId = setInterval(scrollTable, 3000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(scrollTimeoutRef.current);
      clearTimeout(pauseTimeoutRef.current);
      clearTimeout(userScrollTimeoutRef.current);
      scrollContainer.removeEventListener('wheel', handleUserScroll);
      scrollContainer.removeEventListener('touchmove', handleUserScroll);
    };
  }, [scroll, isUserScrolling]);

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto w-full scroll-smooth ${className}`}
      style={{ scrollBehavior: 'smooth' }}
    >
      {children}
    </div>
  );
};

export default AutoScroll;