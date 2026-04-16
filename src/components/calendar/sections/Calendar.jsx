import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    format,
    setMonth,
    setYear,
    isSameDay,
    isToday,
    set
} from "date-fns";
import { useState } from "react";

export default function Calendar({ events }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);



    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const startDayIndex = getDay(monthStart);

    const eventYears = events?.length
        ? [...new Set(
            events.map(event => new Date(event.date).getFullYear())
        )].sort((a, b) => a - b)
        : [];

    const eventMonths = events?.length
        ? [...new Set(
            events.map(event => new Date(event.date).getMonth())
        )].sort((a, b) => a - b)
        : [];

    const daysInMonth = eachDayOfInterval({
        start: monthStart,
        end: monthEnd,
    });

    const emptyDays = Array.from({ length: startDayIndex });

    const handleMonthChange = (e) => {
        const newDate = setMonth(currentMonth, parseInt(e.target.value));
        setCurrentMonth(newDate);
    };

    const handleYearChange = (e) => {
        const newDate = setYear(currentMonth, parseInt(e.target.value));
        setCurrentMonth(newDate);
    };



    return (
        <>
            {/* Month + Year Select */}
            <div className="mb-3 flex gap-2">
                <select
                    className="rounded-md px-2 py-1 text-sm"
                    value={currentMonth.getMonth()}
                    onChange={handleMonthChange}
                >
                    {Array.from({ length: 12 }).map((_, i) => (
                        <option key={i} value={i}>
                            {format(new Date(2025, i), "MMMM")}
                        </option>
                    ))}
                </select>

                <select
                    className="rounded-md px-2 py-1 text-sm"
                    value={currentMonth.getFullYear()}
                    onChange={handleYearChange}
                >
                    {eventYears.length > 0 ? (
                        eventYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))
                    ) : (
                        <option value={currentMonth.getFullYear()}>
                            {currentMonth.getFullYear()}
                        </option>
                    )}
                </select>
            </div>


           

            {/* Week Header */}
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <span key={day}>{day}</span>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {daysInMonth.map((day) => {
                    const formattedDay = format(day, "yyyy-MM-dd");
                    const dayEvents = events?.filter(
                        (event) => event.date === formattedDay
                    ) || [];

                    const hasEvent = dayEvents.length > 0;

                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => setSelectedDate(day)}
                            className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm cursor-pointer
                                ${isSelected ? "bg-gray-300 text-black" : ""}
                                ${isToday(day) && !isSelected ? "text-white bg-[#0073D9]" : ""}
                                hover:bg-muted`}
                        >
                            {format(day, "d")}
                            {hasEvent && (
                                <div className="absolute flex gap-1">
                                    {dayEvents.slice(0, 2).map((event) => (
                                        <span
                                            key={event.id}
                                            className={`h-9 w-9 flex justify-center items-center rounded-full text-sm cursor-pointer text-white ${event.color}`}
                                        >{format(day, "d")}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}