import { type HistoryDef } from "@genroot/builder/engine/generatorDef";

export function History({ history }: { history: HistoryDef }) {
  return (
    <div className="mt-16 border-t border-gray-200 pt-8 text-gray-500">
      <h2 className="font-bold text-base mb-4">Updates</h2>
      <ul className="list-disc list-outside ml-4">
        {history.map((entry, index) => {
          return (
            <li key={index} className="mb-2">
              {entry}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
