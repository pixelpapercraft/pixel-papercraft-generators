import { GeneratorPage } from "@genroot/ui/pages/generatorPage";

type Params = {
  generatorId: string;
};

type Props = {
  params: Params | Promise<Params>;
};

export default async function Page(props: Props) {
  const { params } = props;
  const { generatorId } = await params;
  return <GeneratorPage generatorId={generatorId} />;
}
