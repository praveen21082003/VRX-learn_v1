import { Icon } from "@/components/ui";


function IconContainer({ icon, size = 40, textClass="text-main" }) {
    return (
        <div className={`flex justify-center items-center bg-table-header ${textClass} h-20 w-20 rounded-xl`}>
            <Icon
                name={icon}
                height={size}
                width={size}
                className="text-primary-main"
            />
        </div>
    );
}

export default IconContainer;