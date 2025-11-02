interface CoutryStatsItemProps {
  label: string;
  value: string;
}

export function CoutryStatsItem({ label, value }: CoutryStatsItemProps) {
  return (
    <div className="flex w-full justify-between gap-3 overflow-hidden">
      <p className="text-start text-muted-foreground">{label}</p>
      <p className="text-end">{value}</p>
    </div>
  );
}
