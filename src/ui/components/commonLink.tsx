import Link from "next/link";

export type CommonLinkProps = {
  href: string;
  target?: "_blank";
  children: React.ReactNode;
};

export function CommonLink({
  href,
  target,
  children,
}: CommonLinkProps): JSX.Element {
  const className = "font-medium hover:underline text-green-600";
  return (
    <Link className={className} href={href} target={target}>
      {children}
    </Link>
  );
}
