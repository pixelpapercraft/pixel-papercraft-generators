import { GeneratorPage } from "@/ui/pages/generatorPage";

type Params = {
  generatorId: string;
};

type Props = {
  params: Params;
};

export default function Page(props: Props) {
  const { params } = props;
  return <GeneratorPage generatorId={params.generatorId} />;
}
