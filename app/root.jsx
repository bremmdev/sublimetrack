import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch
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
                to="/budgets"
                className={({ isActive }) =>
                  isActive ? "active-link" : null
                }
              >
                <IoWalletOutline className="nav-icon" />
                <span className="hidden-mobile">Budgets</span>
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
    <Document>
      <Layout>
        <h1>Oops...something went wrong</h1>
        <p className="error-boundary-msg">{error.message}</p>
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const errorMessage = caught.data ? JSON.stringify(caught.data, null, 2).replace(/['"]/gi, '') : `${caught.status}: ${caught.statusText}`

  return (
    <Document>
      <Layout>
        <h1>Oops...something went wrong</h1>
        <p className="error-boundary-msg">{errorMessage}</p>
      </Layout>
    </Document>
  );
}

