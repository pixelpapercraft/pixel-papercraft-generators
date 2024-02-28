export function ButtonControl({
  onClick,
  id,
}: {
  onClick: () => void;
  id: string;
}) {
  return (
    <div className="mb-4">
      <button onClick={onClick}>{id}</button>
    </div>
  );
}
