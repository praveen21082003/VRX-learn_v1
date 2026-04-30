import { Icon as IconifyIcon } from "@iconify/react";
import clsx from "clsx";

export default function Icon({
    name,
    size,
    width,
    height,
    className,
    ...rest
}) {
    return (
        <IconifyIcon
            icon={name}
            width={size || width}
            height={size || height}
            className={clsx("inline-block shrink-0", className)}
        />
    );
}
