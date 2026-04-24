import { MarkdownContent } from '@/components/ui'
import ContentRenderer from '@/components/content/ContentRenderer';

function LessonPreview({ initialData }) {
    const lesson = initialData;
    return (
        <div className="space-y-4">
            <h3 className="text-h3">Lesson: {lesson?.title}</h3>
            <MarkdownContent content={lesson?.description} label="OverView"/>
            <ContentRenderer lesson={initialData} setVideoDuration={() => {}} />
        </div>
    );
}

export default LessonPreview;