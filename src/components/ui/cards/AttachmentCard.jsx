import { Icon } from "@/components/ui";

function AttachmentCard({ fileName, url, loading }) {

    if (loading) {
        return (
            <div className="flex items-center gap-3 border border-default p-2 rounded-lg w-fit min-w-[180px] animate-pulse">

                <div className="w-9 h-9 bg-gray-200 rounded-md"></div>


                <div className="h-4 w-24 bg-gray-200 rounded"></div>

                <div className="w-5 h-5 bg-gray-200 rounded ml-2"></div>

            </div>
        )
    }

    return (
        <div className="group flex items-center gap-3 p-2 pr-4 bg-surface border border-default rounded-xl hover:shadow-md transition-all duration-200 min-w-52 max-w-2xs">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 text-primary dark:text-text-main-dark rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon
                    name="ri:file-pdf-2-line"
                    height="26" width="26"
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-body font-medium text-foreground truncate leading-tight">
                    {fileName}
                </p>
                {/* <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
          {} File
        </p> */}
            </div>

            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 p-1.5 bg-primary/10 dark:text-text-main-dark hover:bg-primary hover:text-white rounded-full text-primary transition-colors"
                title="View Attachment"
            >
                <Icon name="ri:external-link-line" height="26" width="26" />
            </a>
        </div>
    );
}

export default AttachmentCard;
