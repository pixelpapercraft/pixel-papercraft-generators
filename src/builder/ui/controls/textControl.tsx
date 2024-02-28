import React from "react";

export function TextControl({ text }: { text: string }) {
  return (
    <div className="mb-4">
      <p>{text}</p>
    </div>
  );
}
