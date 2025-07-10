import { Routes, Route } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Contacts from "@/components/pages/Contacts";
import DealPipeline from "@/components/pages/DealPipeline";
import Calendar from "@/components/pages/Calendar";
import Leaderboard from "@/components/pages/Leaderboard";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/pipeline" element={<DealPipeline />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Layout>
  );
}

export default App;