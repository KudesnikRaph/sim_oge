import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
      <footer>Footer content</footer>
    </div>
  );
}

export default Layout;
