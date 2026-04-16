import courseContentImg from "@/assets/images/courseContent.svg";
import { Button } from "@/components/ui"
import { useNavigate } from "react-router-dom";


export default function CourseContentPlaceholder() {

    const navigate = useNavigate();


    return (
        <div className="flex flex-col gap-4 w-2xl items-center">
            <img
                src={courseContentImg}
                alt="Content coming soon"
                className="w-64"
            />
            <h1 className="text-h3 text-main">
                Course Content is in Preparation
            </h1>
            <h3 className="text-h5 text-muted text-center">Please check back later for exciting lessons and assignments. The course modules are currently being finalized. </h3>
            <Button
                buttonName="Back to Dashboard"
                className="rounded py-3 px-5.5"
                onClick={() => navigate('/dashboard')}
            />
        </div>
    )
}