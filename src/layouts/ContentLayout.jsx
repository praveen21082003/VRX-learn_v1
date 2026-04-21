import { Outlet } from "react-router-dom";
import { Header } from "@/components/ui";

export default function ContentLayout() {
    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <Header menu={false} />
            <div className="flex-1 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
}