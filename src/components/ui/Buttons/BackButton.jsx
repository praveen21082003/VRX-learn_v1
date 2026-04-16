import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui";

export default function BackButton({
    label = "",
    iconName = "",
    to = -1,
    replace = true,
}) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to, replace)}
            className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-white/70 hover:underline cursor-pointer"
        >
            {iconName &&
                <Icon
                    name={iconName}
                    width="18px"
                    height="18px"
                />
            }
            {label && <>{label}</>}
        </button>
    );
}
