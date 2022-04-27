import { Links, LiveReload, Meta, NavLink, Outlet, Scripts, ScrollRestoration, useCatch} from "remix";
import { useState } from 'react'
import { FiMonitor, FiSun } from "react-icons/fi";
import { IoStatsChart, IoSettingsSharp, IoWalletOutline,} from "react-icons/io5";
import { MdViewList, MdOutlineDarkMode } from "react-icons/md";

import logoDarkUrl from "~/images/logo.svg";
import logoLightUrl from "~/images/logo_light.svg"
import globalStyles from "~/styles/global.css";

export const links = () => [{ href: globalStyles, rel: "stylesheet" }];



export const ThemeContext = React.createContext()

const clientThemeCode = `(() => {
  console.log('nuuuu')
})()`

function SetThemeOnLoad() {
  return <script dangerouslySetInnerHTML={{__html: clientThemeCode}}></script>
}

function ThemeProvider ({ children }) {
  const [theme, setTheme] = useState('dark')

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  ); 
}

function App() {

  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

function Document({ children, title }) {
  const [theme] = React.useContext(ThemeContext)

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <SetThemeOnLoad />
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
  const [theme, setTheme] = React.useContext(ThemeContext)  
  const logoUrl = theme === 'dark' ? logoDarkUrl : logoLightUrl

  const changeTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="container">
      <div className="theme-toggle" onClick={changeTheme}>{theme === 'light' ? <MdOutlineDarkMode className="theme-toggle-icon"/> : <FiSun className="theme-toggle-icon"/> }</div>
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

      <main className="main-container p-4">{children}</main>
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

