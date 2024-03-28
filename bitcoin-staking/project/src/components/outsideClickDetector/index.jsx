import React, { useEffect, useRef } from 'react';

const OutsideClickDetector = ({ children, onOutsideClick }) => {
  const outRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (outRef.current && !outRef.current.contains(e.target)) {
        onOutsideClick();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onOutsideClick]);

  return (
    <>
      <div ref={outRef}>{children}</div>
    </>
  );
};

export default OutsideClickDetector;