import { Generator } from "@/builder/ui/generator";

import * as ExampleGenerator from "@/generators/example/exampleGenerator";

export default function Home() {
  return <Generator generatorDef={ExampleGenerator.generator} />;
}
