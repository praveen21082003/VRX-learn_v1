import React from 'react'
import CalendarUi from '../calendar/CalendarUi';

function CalendarSection() {
  return (
    <div className="relative bg-primary-16 noise-overlay rounded-lg p-4 w-full h-full">
        <h3 className='text-h4 text-main'>Calendar & Schedule</h3>
        <CalendarUi/>
    </div>
  )
}

export default CalendarSection
