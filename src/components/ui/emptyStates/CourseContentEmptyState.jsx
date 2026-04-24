import React from "react";
import { Button } from "@/components/ui";
import { NoContent } from "@/assets";

function CourseContentEmptyState({
    image = NoContent,
    title = "No Data Found",
    description = "There is nothing to display here.",
    buttonText,
    onButtonClick,
    fullScreen = false,
}) {
    return (
        <div
            className={`flex flex-col justify-center items-center text-center gap-4 ${fullScreen ? "h-screen w-full" : "py-10 w-full"
                }`}
        >

            <img src={image} alt="empty-state" className="w-96 h-auto" />


            <h2 className="text-h3 font-semibold">{title}</h2>


            <p className="text-muted-foreground max-w-md">{description}</p>


            {buttonText && onButtonClick && (
                <Button
                    buttonName={buttonText}
                    onClick={onButtonClick}
                    className="mt-2 p-2 rounded"
                />
            )}
        </div>
    );
}

export default CourseContentEmptyState;
