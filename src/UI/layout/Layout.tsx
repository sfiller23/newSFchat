import type { ReactNode } from "react";
import "./_layout.scss";

const Layout = (props: { children: ReactNode }) => {
  const { children } = props;
  return <div className="app-container">{children}</div>;
};

export default Layout;
