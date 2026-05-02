import React from "react";
import { Icon } from '@/components/ui'


function CourseTableMobileCard({ row, columns, loading }) {
  const getCol = (key) => columns.find((c) => c.key === key);


  if (loading) {
    return (
      <div className="relative p-3 mt-2 border border-default rounded-lg shadow-sm animate-pulse">


        <div className="absolute top-3 right-3 w-20 h-5 bg-gray-200 rounded" />


        <div className="absolute bottom-3 right-3 flex gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>

        <div className="flex flex-col gap-2 pr-20">


          <div className="w-40 h-4 bg-gray-300 rounded" />


          <div className="w-32 h-3 bg-gray-200 rounded" />

          <div className="w-full h-3 bg-gray-200 rounded" />
          <div className="w-3/4 h-3 bg-gray-200 rounded" />

          <div className="w-28 h-3 bg-gray-200 rounded mt-2" />

        </div>
      </div>
    );
  }

  console.log(row)


  return (
    <div className="relative p-3 mt-2 border border-default rounded-lg shadow-sm">


      <div className="absolute top-3 right-3">
        <span className="text-xs bg-[#D1E7DD] text-[#0F5132] px-2 py-0.5 rounded">
          {row.noOfTrainees} Trainees
        </span>
      </div>


      <div className="absolute bottom-3 right-3 flex gap-2">
        {getCol("actions")?.render?.(row)}
      </div>


      <div className="flex flex-col gap-1 pr-20">

        {/* Title */}
        <p className="text-h5 text-main truncate">
          {row.title}
        </p>

        {/* Trainers */}
        <p className="text-emphasis text-main flex items-center gap-1">
          <Icon name="mdi:users" height="16" width="16" />
          {/* Trainer: {getCol("trainers")?.render?.(row)} */}
          Trainer: {row.trainerName}
        </p>

        {/* Description */}
        <p title={row.shortDescription} className={`h-10 text-caption overflow-hidden leading-5 line-clamp-2 ${!row.shortDescription ? "text-muted italic" : ""}`}>
          {row.shortDescription || "No description provided"}
        </p>

        {/* Created Date */}
        <p className="text-caption text-muted mt-1">
          {/* Created At: {getCol("createdAt")?.render?.(row)} */}
          Created At: {row.createdAt}
        </p>
      </div>
    </div>
  );
}

export default CourseTableMobileCard;