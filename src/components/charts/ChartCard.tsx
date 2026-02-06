import { Card } from "@/components/ui/Card";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <Card className={className}>
      <div className="p-5">
        <h3 className="text-xs md:text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
          {title}
        </h3>
        {children}
      </div>
    </Card>
  );
}
