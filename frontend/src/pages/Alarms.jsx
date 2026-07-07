import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { FaPlus, FaClock, FaToggleOn, FaToggleOff, FaCalculator, FaPuzzlePiece, FaQuestionCircle, FaChevronRight } from 'react-icons/fa';

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "math":
      return FaCalculator;
    case "memory":
      return FaPuzzlePiece;
    case "logic":
    default:
      return FaQuestionCircle;
  }
};

export const AlarmsPage = () => {
  const [alarms, setAlarms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('07:00');
  const [category, setCategory] = useState('math');

  const fetchAlarms = async () => {
    try {
      const res = await apiClient.get('/alarms');
      setAlarms(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await apiClient.post('/alarms', {
      alarm_time: newAlarmTime,
      challenge_category: category,
      days_of_week: 'MON,TUE,WED,THU,FRI',
    });
    setShowModal(false);
    fetchAlarms();
  };

  const toggleAlarm = async (id) => {
    await apiClient.put(`/alarms/${id}/toggle`);
    fetchAlarms();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div>
          <h2>Alarm Scheduler</h2>
          <p>View, toggle, and create your cognitive alarms.</p>
        </div>
        <button 
          type="button"
          onClick={() => setShowModal(true)}
          className="btn-gradient btn-inline"
        >
          <FaPlus /> New Alarm
        </button>
      </div>

      <div className="upcoming-section">
        <div className="alarm-list">
          {alarms.length > 0 ? alarms.map((alarm) => {
            const Icon = getCategoryIcon(alarm.challenge_category);
            const statusKey = alarm.is_active ? "active" : "inactive";
            return (
              <div className="alarm-item" key={alarm.id}>
                <div className={`alarm-icon ${statusKey}`}>
                  <Icon />
                </div>
                <div className="alarm-info">
                  <h4>{alarm.alarm_time}</h4>
                  <p className="capitalize">{alarm.challenge_category} Challenge • {alarm.days_of_week}</p>
                </div>
                <button 
                  onClick={() => toggleAlarm(alarm.id)} 
                  style={{ 
                    fontSize: '28px', 
                    color: alarm.is_active ? 'var(--color-purple)' : 'var(--color-text-muted)', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {alarm.is_active ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
            );
          }) : <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No alarms found. Create one!</p>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Alarm</h2>
            </div>
            <form onSubmit={handleCreate} className="auth-form">
              <label>Time</label>
              <div className="input-group">
                <FaClock className="input-icon" />
                <input 
                  type="time" 
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  required
                />
              </div>
              <label>Challenge Category</label>
              <div className="input-group">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--color-border)', 
                    background: 'var(--color-card-solid)', 
                    fontSize: '14px', 
                    color: 'var(--color-text)',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="math">Math</option>
                  <option value="memory">Memory</option>
                  <option value="logic">Logic</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient"
                >
                  Save Alarm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};