import { type HistoryDef } from "@genroot/builder/modules/generatorDef";

export function History({ history }: { history: HistoryDef }) {
  return (
    <div className="pt-16 text-gray-500">
      <h1 className="font-bold text-2xl mb-4">Updates</h1>
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
