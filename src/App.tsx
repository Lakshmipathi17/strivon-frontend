import Home from "./pages/Home";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import TrainerLoginPage from "./pages/TrainerLoginPage";
import SelfTrainedDetails from "./pages/SelfTrainedDetails";
import ClientDetails from "./pages/ClientDetails";
import ClientsList from "./pages/ClientsList";
import Dashboard from "./pages/Dashboard";
import TrainerProtectedRoute from "./components/TrainerProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trainer" element ={<TrainerLoginPage/>} />
        <Route path="/self-trained-details" element={<SelfTrainedDetails/>} />
        <Route path="/client-details" element={    
          <TrainerProtectedRoute>
            <ClientDetails />
          </TrainerProtectedRoute>} />
        <Route path="/clients-list" element={    
          <TrainerProtectedRoute>
            <ClientsList />
          </TrainerProtectedRoute>
        } />
        <Route path="/dashboard" element={    <ProtectedRoute><Dashboard/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;