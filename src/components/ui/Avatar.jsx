function Avatar({ name = "" }) {

    function getColor(name = "") {
        let hash = 0;

        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 65%, 55%)`;
    }

    const initials = name
        ? name
            .split(" ")
            .map(n => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "NA";

    return (
        <div
            className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-semibold"
            style={{ backgroundColor: getColor(name) }}
        >
            {initials}
        </div>
    );
}

export default Avatar;