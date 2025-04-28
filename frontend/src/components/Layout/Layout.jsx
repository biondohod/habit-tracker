import React from "react";
import Header from "../Header/Header";

const Layout = ({ children, showHeader = true }) => {
  return (
    <>
      {showHeader && <Header />}
      <main style={{ marginTop: showHeader ? "91px" : 0 }}>{children}</main>
    </>
  );
};

export default Layout;
