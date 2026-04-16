import { Icon } from "@/components/ui";


function IconContainer({ icon, size = 40 }) {
    return (
        <div className="flex justify-center items-center bg-table-Header-bg text-main h-20 w-20 rounded-xl">
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