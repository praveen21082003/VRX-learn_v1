import { MarkdownContent, AttachmentCard } from "@/components/ui";
import useMedia from '@/components/content/hook/useMedia'

function InstructionsTab({ instructions, attachment }) {

    const mediaId = attachment?.mediaId;

    const { url, loading: mediaLoading } = useMedia(mediaId);

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
                            loading={mediaLoading}
                        />
                    </div>
                </>
            )}
        </>
    )
}

export default InstructionsTab
