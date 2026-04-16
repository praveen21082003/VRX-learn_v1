import React from 'react';
// import Graph from '@/components/ui/graph/Graph';
import { IconContainer } from "@/components/ui";

function AnalyticsPreview({ loading = false, learningData = null }) {

    const renderContent = () => {

        if (loading) {
            return (
                <div className="flex flex-col gap-4 animate-pulse">
                    <div className="h-6 w-32 bg-main/10 rounded" />
                    <div className="h-40 w-full bg-main/5 rounded-xl" />
                </div>
            );
        }

        if (!learningData) {
            return (
                <div className='flex flex-col gap-4 items-center justify-center py-6'>
                    <div className="flex justify-center items-center bg-table-Header-bg text-main h-16 w-16 rounded-xl">
                        <IconContainer icon="uil:statistics" className="text-primary-main h-8 w-8" />
                    </div>

                    <div className='flex flex-col gap-2 text-center'>
                        <h4 className='text-h4 font-bold text-main'>Analytics Preview</h4>
                        <p className='text-body text-muted max-w-[280px] mx-auto'>
                            Start learning to track your progress and unlock milestones.
                        </p>
                    </div>
                </div>
            );
        }


        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end text-main">
                    <div>
                        <h3 className="text-h4 font-semibold">Learning Statistics</h3>
                        <p className="text-ll text-muted">Hours This Week</p>
                    </div>
                    <p className="text-h3 font-bold">{learningData?.totalHours} hrs</p>
                </div>

                <div className="relative block w-full h-40 mt-2 overflow-hidden">
                    {/* <Graph data={learningData.weeklyStats} /> */}
                </div>
            </div>
        );
    };

    return (
        <section className="relative bg-primary-16 noise-overlay rounded-xl p-6 w-full z-10">
            {renderContent()}
        </section>
    );
}

export default AnalyticsPreview;