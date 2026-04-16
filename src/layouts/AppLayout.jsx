import Header from "@/components/ui/Header";
import { Outlet } from "react-router-dom";
import { useRef } from "react";

export default function AppLayout() {


    return (
        <div className="h-screen bg-background w-screen flex flex-col overflow-hidden">
            <Header menu={true} />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
