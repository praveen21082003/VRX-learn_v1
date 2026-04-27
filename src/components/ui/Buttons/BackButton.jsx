import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui";

export default function BackButton({
    label = "",
    iconName = "famicons:arrow-back-sharp",
    to = -1,
    replace = true,
    onClick
}) {
    const navigate = useNavigate();

    return (
        <button
            onClick={onClick || (() => navigate(to, replace))}
            className="w-[95%] flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-white/70 hover:underline cursor-pointer"
        >
            {iconName &&
                <Icon
                    name={iconName}
                    width="18px"
                    height="18px"
                />
            }
            {label && <span className="truncate">{label}</span>}
        </button>
    );
}
