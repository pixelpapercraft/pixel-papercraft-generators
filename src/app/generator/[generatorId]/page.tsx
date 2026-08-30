import { GeneratorPage } from "@genroot/ui/pages/generatorPage";

type Params = {
  generatorId: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  return <GeneratorPage generatorId={params.generatorId} />;
}
