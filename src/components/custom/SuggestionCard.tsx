import React from "react";

interface SuggestionCardType {
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  item: { summary: string; experience_level: string };
}

function SuggestionCard({ setSummary, item}: SuggestionCardType) {
  return (
    <div>
      <div
      
        onClick={() => setSummary(item?.summary)}
        className="p-5 shadow-lg my-4 rounded-lg cursor-pointer"
      >
        <h2 className="font-bold my-1 text-primary">
          Level: {item?.experience_level}
        </h2>
        <p>{item?.summary}</p>
      </div>
    </div>
  );
}

export default SuggestionCard;
