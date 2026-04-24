import React from "react";
import { MarkdownContent } from "@/components/ui";


function Overview({ lesson }) {

    return (
        <MarkdownContent content={lesson?.description || "No Overview avilable"} />
    );
}

export default Overview;
