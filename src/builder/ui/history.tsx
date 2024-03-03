import { type GeneratorDef } from "@genroot/builder/modules/generatorDef";

export function History({ generatorDef }: { generatorDef: GeneratorDef }) {
  return (
    <div className="pt-16 text-gray-500">
      <h1 className="font-bold text-2xl mb-4">Updates</h1>
      <ul className="list-disc list-outside ml-4">
        {generatorDef.history.map((history, index) => {
          return (
            <li key={index} className="mb-2">
              {history}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
