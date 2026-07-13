import { ExampleGeneratorV2UI } from "@genroot/generators/example/exampleGeneratorV2";

// Hardcoded v2 prototype demo route — no registry plumbing, just the one
// generator this prototype ports.
export default function Page() {
  return (
    <div className="p-8">
      <ExampleGeneratorV2UI />
    </div>
  );
}
