import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css';

function Calendar({ onDateSelect }) {
  const events = [
    // { title: 'Conference', date: '2025-09-10' },
    // { title: 'Birthday Party', date: '2025-09-19' },
    // { title: 'Birthday Party', date: '2025-09-19' }
  ];

  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr;
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
  };

  const handleDateClick = (clickInfo) => {
    const selectedDate = clickInfo.dateStr;
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
  };

  return (
    <div className="fc-medium">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="70vh"
        events={events}
        selectable={true}
        editable={true}
        select={handleDateSelect}
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next'
        }}
      />
    </div>
  );
}

export default Calendar;
