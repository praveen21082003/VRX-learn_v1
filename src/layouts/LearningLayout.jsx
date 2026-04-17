import { Outlet, useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header, BackButton } from "@/components/ui"




export default function LearningLayout() {

    const location = useLocation();
    const { courseId } = useParams();


    const isOverviewPage = location.pathname === `/course/${courseId}/overview`;


    const backPath = isOverviewPage
        ? "/dashboard"
        : `/course/${courseId}/overview`;




    // We use a ref to store the previous index without triggering extra renders
    const prevIndex = useRef(0);
    const [direction, setDirection] = useState(1);

    const ROUTE_ORDER = {
        overview: 0,

        lessons: 1,
        labs: 1,
        assignments: 1,
        quiz: 1,
    };


    useEffect(() => {
        const pathSegments = location.pathname.split("/");
        const currentPath = pathSegments[pathSegments.length - 1];

        // If it's the base course ID, we treat it as 'overview'
        const normalizedPath = currentPath.match(/^\d+$/) ? "overview" : currentPath;
        const currentIndex = ROUTE_ORDER[normalizedPath] || 0;

        // Compare current vs previous to set direction
        if (currentIndex < prevIndex.current) {
            setDirection(-1);
        } else {
            setDirection(1);
        }

        prevIndex.current = currentIndex;
    }, [location.pathname]);

    // Define the animation variants
    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction > 0 ? "-100%" : "100%",
            opacity: 0,
        }),
    };

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <Header
                menu={false}
            />

            <main className="flex-1 relative overflow-hidden bg-background">
                <AnimatePresence mode="popLayout" custom={direction}>
                    <motion.div
                        key={location.pathname}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="h-full w-full absolute top-0 left-0 overflow-y-auto"
                    >

                        {isOverviewPage &&
                            <div className="block lg:hidden p-2 w-full border-b border-default">
                                <BackButton to={backPath} iconName="material-symbols:arrow-back-rounded" label="Back to Dashboard"/>
                            </div>
                        }

                        <Outlet />

                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}