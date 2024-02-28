function Subtitle({ text }: { text: string }): React.JSX.Element {
  return <p className="mt-1 text-gray-500">{text}</p>;
}

function Title({
  size,
  text,
}: {
  size: "H1" | "H2" | "H3";
  text: string;
}): React.JSX.Element {
  switch (size) {
    case "H1": {
      return <h1 className="text-4xl font-bold">{text}</h1>;
    }
    case "H2": {
      return <h2 className="text-2xl font-bold">{text}</h2>;
    }
    case "H3": {
      return <h3 className="text-xl">{text}</h3>;
    }
  }
}

export type HeadingProps = {
  size: "H1" | "H2" | "H3";
  title: string;
  subtitle?: string | null;
};

export function Heading({
  size,
  title,
  subtitle,
}: HeadingProps): React.JSX.Element {
  return (
    <>
      <Title size={size} text={title} />
      {subtitle ? <Subtitle text={subtitle} /> : null}
    </>
  );
}
