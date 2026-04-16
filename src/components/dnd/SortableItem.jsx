import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {Icon} from '@/components/ui'

function SortableItem({ id, title, isUpdating }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
        bg-primary/16 dark:bg-white/10 px-5 py-2 rounded hover:bg-active hover:text-primary hover:dark:text-white/60 font-semibold
        ${isDragging ? "shadow-2xl scale-105 z-50 cursor-grabbing" : isUpdating ? "cursor-progress" : "cursor-grab"}
      `}
        >
            <Icon name="lsicon:drag-filled" className="text-dark-gray" height="35px"   width="35px" />{title}
        </div>
    );
}

export default SortableItem;
