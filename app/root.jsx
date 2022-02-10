import {
  Links,
  LiveReload,
  Meta,
  Link,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import { FiMonitor } from 'react-icons/fi'
import {IoStatsChart, IoSettingsSharp, IoWalletOutline} from 'react-icons/io5'
import { MdViewList } from 'react-icons/md'

import logoUrl from '~/images/logo.svg'
import globalStyles from '~/styles/global.css'

export const links = () => [{href: globalStyles, rel: 'stylesheet'}]

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
      
      <div className="nav-panel py3">
        <div className="logo-container">
          <img src={logoUrl} alt="sublimetrack logo" className="logo" />
          <h1 className="hidden-mobile">
            sublime<span className="title-highlight">track</span>
          </h1>
        </div>

        <nav className="navbar">
          <ul>
            <li>
            <FiMonitor className="nav-icon"/> <Link to="/" className="hidden-mobile">Overview</Link>
            </li>
            <li>
              <IoWalletOutline className="nav-icon"/><Link to="/budget" className="hidden-mobile">Budget</Link>
            </li>
            <li>
              <MdViewList className="nav-icon"/><Link to="/expenses" className="hidden-mobile">Expenses</Link>
            </li>
            <li>
             <IoStatsChart className="nav-icon"/> <Link to="/insights" className="hidden-mobile">Insights</Link>
            </li>
            <li>
              <IoSettingsSharp className="nav-icon"/><Link to="/settings" className="hidden-mobile">Settings</Link>
            </li>
          </ul>
        </nav>
      </div>

      <main className="main-container p3">{children}</main>
    </div>
  );
}
