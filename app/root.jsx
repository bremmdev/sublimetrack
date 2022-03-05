import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import { FiMonitor } from "react-icons/fi";
import {
  IoStatsChart,
  IoSettingsSharp,
  IoWalletOutline,
} from "react-icons/io5";
import { MdViewList } from "react-icons/md";

import logoUrl from "~/images/logo.svg";
import globalStyles from "~/styles/global.css";

export const links = () => [{ href: globalStyles, rel: "stylesheet" }];

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title ? title : "Sublimetrack"}</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }) {
  return (
    <div className="container">
      <div className="nav-panel py-3">
        <div className="logo-container">
          <img src={logoUrl} alt="sublimetrack logo" className="logo" />
          <h1 className="hidden-mobile">
            sublime<span className="title-highlight">track</span>
          </h1>
        </div>

        <nav className="navbar">
          <ul>
            <li>
             
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "active-link" : null
                }
              >
                 <FiMonitor className="nav-icon" />
                 <span className="hidden-mobile">Overview</span>
              </NavLink>
            </li>
            <li>
              
              <NavLink
                to="/budget"
                className={({ isActive }) =>
                  isActive ? "active-link" : null
                }
              >
                <IoWalletOutline className="nav-icon" />
                <span className="hidden-mobile">Budget</span>
              </NavLink>
            </li>
            <li>
             
              <NavLink
                to="/expenses"
                className={({ isActive }) =>
                  isActive ? "active-link" : null
                }
              >
                 <MdViewList className="nav-icon" />
                 <span className="hidden-mobile">Expenses</span>
              </NavLink>
            </li>
            <li>
           
              <NavLink
                to="/insights"
                className={({ isActive }) =>
                  isActive ? "active-link" : null
                }
              >
                   <IoStatsChart className="nav-icon" />
                   <span className="hidden-mobile">Insights</span>
              </NavLink>
            </li>
            <li>
              
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? "active-link" : null
                }
              >
                <IoSettingsSharp className="nav-icon" />
                <span className="hidden-mobile">Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <main className="main-container p-3">{children}</main>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
}