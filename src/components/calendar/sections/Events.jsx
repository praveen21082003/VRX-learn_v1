import { format } from "date-fns";
import clsx from "clsx";
import { Icon } from "@/components/ui";


export default function Events({ events }) {


    const noEvent = () => {
        return (
            <div className="flex flex-col gap-2 justify-center rounded-2xl py-4 items-center w-full bg-background">
                <Icon name="ph:calendar-x-duotone" height="40" width="40" />
                <p className="text-body text-muted">No Upcoming Deadlines</p>
            </div>
        )
    }
    return (
        <div className="space-y-2 py-2 w-full">
            {!events ?
                noEvent()
                :
                <>
                    {events.map(event => {
                        const formattedDate = format(new Date(event.date), "d");
                        const formattedDay = format(new Date(event.date), "EEE")

                        return (
                            <div key={event.id} className="flex gap-4 rounded-xl bg-card text-main px-4 py-2">
                                <div className="flex flex-col justify-center w-7 items-center">
                                    <span className="text-sm">{formattedDay}</span>
                                    <span className="text-lg font-semibold">{formattedDate}</span>
                                </div>
                                <div className={`w-1.5 rounded-full ${event.color}`} />
                                <div className="flex flex-col justify-center">
                                    <span className="font-semibold text-sm">{event.title}</span>
                                    <span className="text-sm">{event.time}</span>
                                </div>

                            </div>
                        )
                    })}
                </>
            }

        </div>
    );
}
