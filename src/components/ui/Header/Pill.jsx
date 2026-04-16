export default function Pill({
    viewRole
}) {

    return (
        <div className={`w-15 px-2 py-0.5 rounded text-xs font-medium ${viewRole === "TRAINEE" ? 'bg-[#00BFAE]' : 'bg-[#C5A059]'}`}>
            <span className="capitalize text-white">{viewRole?.toLowerCase().replace(/^./, c => c.toUpperCase())}</span>
        </div>
    )
}