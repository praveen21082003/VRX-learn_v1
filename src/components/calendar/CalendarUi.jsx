import React from 'react'
// import useEvents from './hooks/useEvents'
import Calendar from './sections/Calendar';
import Events from './sections/Events';

function CalendarUi() {
    // const { events, loading, error } = useEvents();
    // console.log(events)

    // if (!events && loading) {
    //   return <p>loading...</p>
    // }

    const events = [];


    return (
        <div>
            <div className="w-full rounded-xl bg-card text-main p-4">
                <Calendar />
            </div>

            <Events events={null} />

        </div>

    )
}

export default CalendarUi
