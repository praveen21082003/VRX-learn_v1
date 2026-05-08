import React from 'react'
import Header from "@/components/ui/Header";
import { Outlet } from "react-router-dom";

function ReportLayout() {
    return (
        <div className="h-screen bg-background w-screen flex flex-col overflow-hidden">
            <Header headerContent={<span className='hidden sm:block text-h4'>Report a problem</span>} />
            <main className="flex-1 overflow-y-auto overflow-hidden">
                <Outlet />
            </main>
        </div>
    )
}

export default ReportLayout
