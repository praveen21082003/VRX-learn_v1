import { Icon as IconifyIcon } from "@iconify/react";
import clsx from "clsx";

export default function Icon({
    name,
    size = 22,
    className,
    ...props
}) {
    return (
        <IconifyIcon
            icon={name}
            width={size}
            height={size}
            className={clsx("inline-block shrink-0", className)}
            {...props}
        />
    );
}
