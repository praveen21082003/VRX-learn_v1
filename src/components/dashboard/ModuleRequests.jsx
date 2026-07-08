import React from "react";

function ModuleRequests() {
  const moduleRequests = [
    {
      id: 1,
      title: "Complete Node.js",
      course: "Advanced Web Development",
      status: "Requested",
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Complete React.js",
      course: "Frontend Development",
      status: "Rejected",
      color: "text-primary",
    },
  ];

  return (
    <div >
      <div className="flex justify-between mb-2">
        <h4 className="text-h4 text-main">Module Request</h4>
        <button className=" text-[#0088FF] underline underline-offset-3  font-semibold cursor-pointer">
          View all
        </button>
      </div>

      {moduleRequests.map((module) => (
        <div
          key={module.id}
          className="flex flex-col gap-1 border border-default p-3"
        >
          <h5 className="text-h5 text-main ">{module.title}</h5>
          <p className="text-muted">{module.course}</p>
          <p className={module.color}>{module.status}</p>
        </div>
      ))}
    </div>
  );
}

export default ModuleRequests;
