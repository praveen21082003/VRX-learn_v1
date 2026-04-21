import React, { useState, useEffect } from 'react'
import { closestCorners, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Icon } from '@/components/ui'
import SortableItem from './SortableItem'
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { useToast } from "@/context/ToastProvider"



function ReorderList({ items, reorder, isUpdating, onReorderUI }) {

    const { addToast } = useToast();

    const { courseSlug } = useParams();
    // console.log(courseSlug);
    const [data, setData] = useState(items);
    // console.log(data)
    // console.log(items)

    useEffect(() => {
        setData(items);
    }, [items]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = data.findIndex(i => i.id === active.id);
        const newIndex = data.findIndex(i => i.id === over.id);

        // 1. Calculate New State
        const newArray = arrayMove(data, oldIndex, newIndex);

        // 2. Optimistic UI Update (Snappy feel)
        const previousData = [...data];
        setData(newArray);
        onReorderUI?.(newArray);

        // 3. Prepare Payload
        const movedIndex = newIndex;
        const precedingId = newArray[movedIndex - 1]?.id || null;
        const succeedingId = newArray[movedIndex + 1]?.id || null;

        const getCustomErrorMessage = (status) => {
            const map = {
                400: "Invalid move. Please try again.",
                401: "Session expired. Please login again.",
                403: "You don’t have permission.",
                404: "Item not found.",
                409: "Conflict detected. Refresh and retry.",
                500: "Server error. Try again later."
            };

            return map[status] || "Unexpected error occurred.";
        };

        try {
            await reorder(active.id, {
                precedingId,
                succeedingId
            });
            addToast("Modules Reordered successfully", "success")

        } catch (err) {
            setData(previousData);
            onReorderUI?.(previousData);

            const status = err?.response?.status;
            const message = getCustomErrorMessage(status);

            addToast(`${message} ${status ? `(Code: ${status})` : ""}`, "error");
        }
    };


    return (
        <div>
            <DndContext collisionDetection={closestCorners} sensors={sensors} onDragEnd={handleDragEnd} disabled={isUpdating}>
                <SortableContext items={data} strategy={verticalListSortingStrategy} disabled={isUpdating}>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-muted">
                        <Icon name="streamline:one-finger-drag-vertical-remix" height="22px" width="22px" />
                        Drag to Reorder
                    </h3>

                    <div className={clsx('border p-3 mt-3 rounded-lg flex flex-col gap-1',
                        isUpdating && "opacity-90 bg-black/20"
                    )}>
                        {data.map((item) => (
                            <SortableItem
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                isUpdating={isUpdating}
                            />
                        ))}

                    </div>

                </SortableContext>
            </DndContext>
        </div>
    )
}

export default ReorderList
