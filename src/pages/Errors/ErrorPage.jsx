import React from "react";
import { Button, Header } from "@/components/ui";
import { useNavigate } from "react-router-dom";

export default function ErrorPage({ statusCode }) {
    const navigate = useNavigate();

    const errorConfig = {
        404: {
            image: "/errors/404.svg",
            title: "Page Not Found!",
            description:
                "Oops! It looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.",
        },

        403: {
            image: "/errors/403.svg",
            title: "Access Denied!",
            description: "Sorry, you don't have permission to view this page.",
        },
        500: {
            image: "/errors/500.svg",
            title: "Server Error!",
            description:
                "Oops! Something went wrong on our end. We're working to fix it.",
        },
        503: {
            image: "/errors/503.svg",
            title: "Be Right Back!",
            description:
                "The site is currently down for maintenance. Please check back soon.",
        },
    };

    const error = errorConfig[statusCode] || errorConfig[404];


    return (
        <div className=" min-h-screen w-full flex items-center justify-center bg-background text-main px-4 py-10">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-5xl">

                {/* Image */}
                <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md shrink-0">
                    <img
                        src={error.image}
                        alt={error.title}
                        className="w-full h-auto object-contain"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col items-center gap-4 w-full max-w-md text-center lg:text-left">
                    <h1 className="text-h1 font-bold">{error.title}</h1>

                    <p className="text-h45 text-muted">
                        {error.description}
                    </p>

                    <Button
                        type="button"
                        bgClass="bg-primary"
                        className="p-2 rounded-lg w-full sm:w-3/4 lg:w-full"
                        buttonName="Back To Dashboard"
                        onClick={() => navigate("/dashboard")}
                    />
                    
                    <p className="text-ll text-muted">
                        Need Help?{" "}

                        <a href="https://vrnexgen1.com/"
                            className="underline text-primary"
                        >
                            Contact Us
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}
