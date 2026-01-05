import { BaseCard } from "@/components/ui/card-variants";
import { Button } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge-variants";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Good Morning, DK!</h1>
        <p className="text-sm text-foreground-secondary">Monday, January 6, 2026</p>
      </div>

      {/* Test Card */}
      <BaseCard>
        <h2 className="text-xl font-semibold mb-4">Dashboard Working!</h2>
        <p className="text-foreground-secondary mb-4">
          The layout and navigation are set up correctly.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="profit">+₹2,450</Badge>
          <Badge variant="loss">-₹350</Badge>
          <Badge variant="info">80% Win Rate</Badge>
        </div>
      </BaseCard>

      {/* Test Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  );
}
