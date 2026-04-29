import Header from "@/components/ui/Header";
import { Outlet } from "react-router-dom";
import { useRef } from "react";

export default function AppLayout() {


    return (
        <div className="h-screen bg-background w-screen flex flex-col overflow-hidden pb-13 md:pb-0">
            <Header menu={true} />
            <main className="flex-1 md:overflow-y-auto overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}
