import { Heading } from "./heading";

export type PageHeadingProps = {
  title: string;
  subtitle?: string | null;
};

export function PageHeading({
  title,
  subtitle,
}: PageHeadingProps): React.JSX.Element {
  return (
    <div className="mb-6">
      <Heading size="H1" title={title} subtitle={subtitle} />
    </div>
  );
}

export type PageSubheadingProps = {
  title: string;
};

export function PageSubheading({
  title,
}: PageSubheadingProps): React.JSX.Element {
  return (
    <div className="mb-4">
      <Heading size="H2" title={title} />
    </div>
  );
}
