import { Target } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-primary flex">
      {/* Left Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-card relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-blue/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-btn-primary flex items-center justify-center shadow-glow-brand">
              <Target className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold">TradeMind</span>
          </div>

          {/* Quote */}
          <div className="space-y-6">
            <blockquote className="text-3xl font-bold leading-tight">
              &ldquo;The goal of a successful trader is to make the best trades.{" "}
              <span className="text-brand">Money is secondary.</span>&rdquo;
            </blockquote>
            <cite className="text-foreground-secondary block">
              — Alexander Elder
            </cite>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-brand">1000+</p>
              <p className="text-sm text-foreground-secondary">Active Traders</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-profit">72%</p>
              <p className="text-sm text-foreground-secondary">Avg. Win Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-blue">50K+</p>
              <p className="text-sm text-foreground-secondary">Trades Logged</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-btn-primary flex items-center justify-center shadow-glow-brand">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">TradeMind</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
