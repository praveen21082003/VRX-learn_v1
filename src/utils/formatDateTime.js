
export default function formatDateTime(dateString) {

    if (!dateString) return "N/A";
    const date = new Date(dateString);


    if (isNaN(date.getTime())) return "Invalid Date";

    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    const hasNoTimeProvided = !dateString.includes("T") && !dateString.includes(":");
    const isDefaultISTMidnight = date.getHours() === 5 && date.getMinutes() === 30;

    if (hasNoTimeProvided || isDefaultISTMidnight) {
        return formattedDate; // Just return "28 Mar 2026"
    }

    const today = new Date();
    const isToday =
        date.toDateString() === today.toDateString();

    const timeSuffix = isToday ? " (Today)" : "";

    return `${formattedDate}, ${formattedTime}${timeSuffix}`;
}
