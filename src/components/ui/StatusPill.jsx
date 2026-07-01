import { Icon } from '@/components/ui'
export default function StatusPill({ status = '', iconName = false }) {

  const colors = {
    submitted: "bg-[#D1E7DD] text-[#0F5132]",
    "in-progress": "bg-[#D1E7DD] text-[#0F5132]",
    graded: "bg-[#FEEBC8] text-[#7C2D12]",
    donelate: "bg-[#F8D7DA] text-[#842029]",
    admin: "bg-[#F3E8FF] text-[#3730A3]",
    subadmin: "bg-[#E0F2FE] text-[#0369A1]",
    trainer: "bg-[#FFEDD5] text-[#C2410C]",
    trainee: "bg-[#D1E7DD] text-[#0F5132]",
    active: "bg-[#D1E7DD] text-[#0F5132]",
    inactive: "bg-[#F8D7DA] text-[#840227]",
    pending: "bg-[#FEEBC8] text-[#744210]",
    completed: "bg-[#DBEAFE] text-[#1E40AF]",
    resolved: "bg-[#D1E7DD] text-[#0F5132]",
    premium: "bg-[#610F6D]",
    free: "bg-[#16A34A]"
  };

  return (
    <div className="leading-none">
      <span className={`flex gap-1 items-center capitalize px-1.5 py-0.5 rounded-xs text-small ${colors[status] || "bg-gray-200 text-gray-700"}`}>
        {iconName && <Icon name={iconName} size={14} />}

        {status.toLowerCase().replace(/_/g, " ")}
      </span>
    </div>
  );
}