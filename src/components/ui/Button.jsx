import { Icon } from "@/components/ui"
import clsx from "clsx";

function Button({
    buttonName,
    bgClass = 'bg-[var(--color-primary)]',
    textClass = 'text-white',
    onClick,
    disabled = false,
    type = 'button',
    className,
    frontIconName,
    backIconName,
    frontIconWidth,
    frontIconHeight,
    backIconWidth,
    backIconHeight,
    fontClass = 'text-h5',
    isMobile,
    title
}) {
    const isWhiteBg =
        bgClass.includes('');

    const isIconOnly =
        frontIconName &&
        !buttonName &&
        !backIconName;

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                "flex items-center cursor-pointer justify-center transition-all duration-200",

                fontClass,

                !isIconOnly && "gap-2",
                isIconOnly && "p-0.5",

                className,
                bgClass,
                textClass,

                isWhiteBg && !bgClass && buttonName && !isMobile && "border border-primary dark:border-background",

                disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90 active:scale-[0.98]"
            )}

            title={title}
        >
            {frontIconName && (
                <Icon
                    height={frontIconHeight}
                    width={frontIconWidth}
                    name={frontIconName}
                />
            )}

            {buttonName && !isMobile && <span>{buttonName}</span>}

            {backIconName && (
                <Icon
                    width={backIconWidth}
                    height={backIconHeight}
                    name={backIconName}
                />
            )}
        </button>
    );
}

export default Button;
