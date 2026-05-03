import { useState, useEffect, useRef } from 'react';
import LottiePackage from 'lottie-react';
const Lottie = LottiePackage.default || LottiePackage;
import './App.css';

import plantAnimation from './assets/plant.json';

const API_BASE_URL = 'http://localhost:5034/api/water';
const DAILY_GOAL_ML = 2000;

function App() {
  const [logs, setLogs] = useState([]);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const lottieRef = useRef();

  // initial load
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!amount) return;

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountMl: parseInt(amount) }),
      });
      if (response.ok) {
        setAmount('');
        fetchLogs();
      }
    } catch (error) {
      console.error('Error adding log:', error);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchLogs();
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const startEditing = (log) => {
    setEditingId(log.id);
    setEditAmount(log.amountMl.toString());
  };

  const handleUpdateLog = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountMl: parseInt(editAmount) }),
      });
      if (response.ok) {
        setEditingId(null);
        fetchLogs();
      }
    } catch (error) {
      console.error('Error updating log:', error);
    }
  };

  // tamagotchi plant
  const today = new Date().toLocaleDateString();
  const todaysLogs = logs.filter(log => new Date(log.timestamp).toLocaleDateString() === today);
  const todayIntake = todaysLogs.reduce((sum, log) => sum + log.amountMl, 0);
  
  // percentage cap
  const progressPercentage = Math.min((todayIntake / DAILY_GOAL_ML) * 100, 100);

  // lottie animation control
  
  const updatePlantGrowth = () => {
    if (lottieRef.current) {
      const totalFrames = lottieRef.current.getDuration(true); 
      
      const activeGrowthPortion = 0.5; 
      
      const maxGrowthFrame = totalFrames * activeGrowthPortion;
      
      const targetFrame = (progressPercentage / 100) * maxGrowthFrame;
      
      lottieRef.current.goToAndStop(targetFrame, true);
    }
  };

  useEffect(() => {
    updatePlantGrowth();
  }, [progressPercentage]);

  // messages based on water intake
  let plantMessage = "Your plant needs water to grow...";
  let plantStatusClass = "status-wilted";
  
  if (todayIntake >= DAILY_GOAL_ML) {
    plantMessage = "Plant fully grown & hydrated";
    plantStatusClass = "status-flourishing";
  } else if (todayIntake >= DAILY_GOAL_ML * 0.5) {
    plantMessage = "Plant is growing, keep watering it.";
    plantStatusClass = "status-growing";
  } else if (todayIntake > 0) {
    plantMessage = "A small sprout needs water to grow...";
    plantStatusClass = "status-sprout";
  }

  return (
    <div className="app-container">
      <h2>Hydration Houseplant</h2>
      
      {/* interface */}
      <div className={`plant-container ${plantStatusClass}`}>
        <div className="lottie-wrapper">
          <Lottie 
            lottieRef={lottieRef}
            animationData={plantAnimation} 
            loop={false}
            autoplay={false}
            onDOMLoaded={updatePlantGrowth}
            style={{ height: 250 }}
          />
        </div>
        <p className="plant-message">{plantMessage}</p>
        
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="intake-text">{todayIntake} / {DAILY_GOAL_ML} ml today</p>
      </div>

      {/* adding water form */}
      <form onSubmit={handleAddLog} className="add-form">
        <input
          type="number"
          placeholder="Amount in ml"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />
        <button type="submit" className="btn-primary">Water Plant</button>
      </form>

      {/* list of waters */}
      <div className="log-list-container">
        <h3>Water history</h3>
        {isLoading ? (
          <p className="loading-state">loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="empty-state">No waterings logged yet.</p>
        ) : (
          <ul className="log-list">
            {logs.map((log) => (
              <li key={log.id} className="log-item">
                {editingId === log.id ? (
                  <div className="edit-mode">
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      min="1"
                      className="edit-input"
                    />
                    <div className="actions">
                      <button onClick={() => handleUpdateLog(log.id)} className="btn-success">Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-secondary">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="log-details">
                      <strong>{log.amountMl} ml</strong> at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <br />
                      <small className="date-text">{new Date(log.timestamp).toLocaleDateString()}</small>
                    </span>
                    <div className="actions">
                      <button onClick={() => startEditing(log)} className="btn-secondary">Edit</button>
                      <button onClick={() => handleDeleteLog(log.id)} className="btn-danger">Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;