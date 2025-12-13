import React, { useState, useEffect, use } from 'react';
import dayjs from 'dayjs';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

function Planning() {
    const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("user")).id;

  if (!userId) {
    navigate('/login');
  }

  const [currentWeek, setCurrentWeek] = useState(dayjs().startOf('week'));
  const [events, setEvents] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [eventNames, setEventNames] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  console.log("user : " + userId);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/events/userEvents?userId=${userId}`,);
      console.log(response.message);
      
      if (response.ok) {
        const data = await response.json();
        console.log("data :" + JSON.stringify(data));
        const eventMap = {};
        data.forEach(event => {
          const time = `${event.hour}:00`;  // Convert hour to time string (e.g., 10 -> "10:00")
          const key = `${event.date}-${time}`;
          if (!eventMap[key]) eventMap[key] = [];
          eventMap[key].push({ id: event._id, name: event.name });
        });
        setEvents(eventMap);
      }
    } catch (error) {
      console.log('Error fetching events:', error);
    }
  };

  const saveEvent = async (date, time, names) => {
    const [hourStr] = time.split(':');  // Extract hour as integer if backend needs it
    const hour = parseInt(hourStr, 10);
    for (const name of names) {
      try {
        const response = await fetch('http://localhost:5001/api/events/addEvent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, date, hour, name })  // Send single name and hour
        });
        if (!response.ok) {
          console.error('Error saving event:', name);
        }
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
  };

  const handleDeleteSpecific = async (id) => {
    try {
      const response = await fetch('http://localhost:5001/api/events/deleteEvent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        // Remove from state
        setEvents(prev => {
          const newEvents = { ...prev };
          const slotEvents = newEvents[selectedSlot.key];
          if (slotEvents) {
            newEvents[selectedSlot.key] = slotEvents.filter(e => e.id !== id);
            if (newEvents[selectedSlot.key].length === 0) delete newEvents[selectedSlot.key];
          }
          return newEvents;
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleCellClick = (dayIndex, time) => {  // Changed hour to time
    const date = currentWeek.add(dayIndex, 'day').format('YYYY-MM-DD');
    const key = `${date}-${time}`;
    setSelectedSlot({ date, time, key });  // Changed hour to time
    if (events[key] && events[key].length > 0) {
      setEventNames('');
      setIsEditing(true);
    } else {
      setEventNames('');
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const names = eventNames.split('\n').filter(name => name.trim());
    if (names.length > 0) {
      await saveEvent(selectedSlot.date, selectedSlot.time, names);
      fetchEvents();  // Refresh events
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    // Delete all events in the slot
    const slotEvents = events[selectedSlot.key] || [];
    for (const event of slotEvents) {
      await handleDeleteSpecific(event.id);
    }
    setDialogOpen(false);
  };

  const nextWeek = () => setCurrentWeek(currentWeek.add(1, 'week'));
  const prevWeek = () => setCurrentWeek(currentWeek.subtract(1, 'week'));

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate time slots in 15-minute increments from 8:00 to 19:45
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 19; hour++) {
      for (let min = 0; min < 60; min += 15) {
        if (hour === 19 && min > 45) break;  // Stop at 19:45
        slots.push(`${hour}:${min.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f5f5f7',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e5e7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '600',
            color: '#1d1d1f'
          }}>Weekly Agenda</h1>
          <div>
            <button onClick={prevWeek} style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#007aff',
              marginRight: '10px'
            }}>‹</button>
            <span style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#1d1d1f'
            }}>{currentWeek.format('MMMM YYYY')}</span>
            <button onClick={nextWeek} style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#007aff',
              marginLeft: '10px'
            }}>›</button>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px repeat(7, 1fr)',
          fontSize: '14px'
        }}>
          <div style={{ height: '40px' }}></div>
          {days.map(day => (
            <div key={day} style={{
              textAlign: 'center',
              fontWeight: '500',
              color: '#86868b',
              padding: '10px 0',
              borderBottom: '1px solid #e5e5e7'
            }}>
              {day}<br/>{currentWeek.add(days.indexOf(day), 'day').format('DD')}
            </div>
          ))}
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div style={{
                textAlign: 'right',
                padding: '10px 10px 10px 0',
                color: '#86868b',
                borderRight: '1px solid #e5e5e7',
                borderBottom: time !== timeSlots[timeSlots.length - 1] ? '1px solid #f5f5f7' : 'none'
              }}>
                {time}
              </div>
              {days.map((day, dayIndex) => {
                const date = currentWeek.add(dayIndex, 'day').format('YYYY-MM-DD');
                const key = `${date}-${time}`;
                return (
                  <div
                    key={key}
                    style={{
                      borderRight: dayIndex < 6 ? '1px solid #f5f5f7' : 'none',
                      borderBottom: time !== timeSlots[timeSlots.length - 1] ? '1px solid #f5f5f7' : 'none',
                      minHeight: '40px',
                      padding: '5px',
                      cursor: 'pointer',
                      backgroundColor: events[key] && events[key].length > 0 ? '#e3f2fd' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => handleCellClick(dayIndex, time)}
                  >
                    {events[key] && events[key].map((event, idx) => (
                      <div key={idx} style={{
                        backgroundColor: '#007aff',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: '2px'
                      }}>
                        {event.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {isEditing ? 'Edit Events' : 'Add Events'} - {selectedSlot && `${days[dayjs(selectedSlot.date).day()]} ${dayjs(selectedSlot.date).format('MMM DD')} at ${selectedSlot.time}`}
        </DialogTitle>
        <DialogContent>
          {isEditing && events[selectedSlot.key] && events[selectedSlot.key].length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4>Existing Events:</h4>
              {events[selectedSlot.key].map((event, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span>{event.name}</span>
                  <Button onClick={() => handleDeleteSpecific(event.id)} color="error" size="small">Delete</Button>
                </div>
              ))}
            </div>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Add Event Names (one per line)"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={eventNames}
            onChange={(e) => setEventNames(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {isEditing && (
            <Button onClick={handleDelete} color="error">
              Delete All
            </Button>
          )}
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Planning;