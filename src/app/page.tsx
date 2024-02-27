import { Generator } from "@/builder/ui/generator";

import { generator } from "@/generators/minecraftCharacter/minecraftCharacterGenerator";

export default function Home() {
  return <Generator generatorDef={generator} />;
}
