import React, { useEffect, useRef, useState } from "react";
import Header from "../Header/Header";

const Layout = ({ children, showHeader = true }) => {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showHeader]);

  return (
    <>
      {showHeader && <Header ref={headerRef} />}
      <main style={{ marginTop: showHeader ? headerHeight : 0 }}>
        {children}
      </main>
    </>
  );
};

export default Layout;
