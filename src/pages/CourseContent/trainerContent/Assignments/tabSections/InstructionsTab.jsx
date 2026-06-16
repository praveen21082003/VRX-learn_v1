
import useViewUrl from "@/hooks/useViewUrl";
import { getAssignmentViewUrl } from '@services/Assignments.service'
import { MarkdownContent, AttachmentCard } from "@/components/ui";
import { useParams } from "react-router-dom";

function InstructionsTab({ instructions, attachment }) {

    const { assignmentId } = useParams();

    const {
        url,
        loading,
        error,
    } = useViewUrl(
        assignmentId,
        getAssignmentViewUrl,
        {
            404: "Assignment attachment not found.",
            403: "You do not have access to this attachment.",
        },
        {
            enabled: !!attachment,
        }
    );


    return (
        <>
            <MarkdownContent content={instructions || ""} />

            {/* No attachment */}
            {!attachment && null}

            {/* With attachment */}
            {attachment && (
                <>
                    <h1 className="text-h45 mt-6">Attachments</h1>

                    <div className="flex flex-wrap gap-3 mt-2">
                        <AttachmentCard
                            fileName={attachment.filename}
                            url={url}
                            loading={loading}
                        />
                    </div>
                </>
            )}
        </>
    )
}

export default InstructionsTab
