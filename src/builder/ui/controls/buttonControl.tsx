import { Button } from "@/builder/ui/button/button";

export function ButtonControl({
  onClick,
  id,
}: {
  onClick: () => void;
  id: string;
}) {
  return (
    <div className="mb-4">
      <Button size="Small" onClick={onClick}>
        {id}
      </Button>
    </div>
  );
}
