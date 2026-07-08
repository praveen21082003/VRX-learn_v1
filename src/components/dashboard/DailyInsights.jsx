import React from "react";
import { Icon } from "@/components/ui";
import { quotes, todaysTips } from "../../utils/quotesData";

function DailyInsights() {
  const day = new Date().getDate();
  const quote = quotes[day % quotes.length];
  const tip = todaysTips[day % todaysTips.length];

  return (
    <div>
      <div className="space-y-2">
        <h4 className="text-h4 text-main mb-2">Quotes of the Day</h4>
        <div className="flex gap-5">
          <Icon
            name="ri:chat-quote-line"
            width="24"
            height="24"
            className="text-primary"
          />
          <p className="text-muted">"{quote.quote}"</p>
        </div>
        <p className="text-center text-muted font-bold">-{quote.author}</p>
      </div>

      <div className="space-y-2 mt-4 mb-2">
        <h4 className="text-h4 text-main mb-2 ">Today's Tip</h4>
        <div className="flex gap-5">
          <Icon
            name="ic:outline-tips-and-updates"
            width="24"
            height="24"
            className="text-primary"
          />
          <p className="text-muted">{tip}</p>
        </div>
      </div>
    </div>
  );
}

export default DailyInsights;
