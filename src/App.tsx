import { useState, type ComponentProps } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import HomeWindow from "./components/homescreen/HomeWindow";
import TestResult from "./components/resultscreen/ResultScreen";
import Dashboard from "./components/dashboard/Dashboard";
import UserStatistics from "./components/userstatistics/UserStatistics";
import Settings from "./components/settingsscreen/Settings";
import ProfileScreen from "./components/profiilescreen/ProfileScreen";

function ResultRoute() {
  const { state } = useLocation();

  return <TestResult {...(state as ComponentProps<typeof TestResult>)} />;
}

function Layout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>
    </>
  );
}

function App() {
  const [sessionTime, setSessionTime] = useState(0);

  const addSessionTime = (time: number) => {
    setSessionTime((prev) => prev + time);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeWindow sessionTime ={sessionTime} addSessionTime={addSessionTime}/>} />
          <Route path="/result" element={<ResultRoute />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<UserStatistics />} />
          <Route path="/settings"  element= {<Settings/>} />
          <Route path="/profile"  element= {<ProfileScreen/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
