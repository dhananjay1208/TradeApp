"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Target,
  LineChart,
  Shield,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Pre-Market Ritual",
    description: "Start each day with a disciplined routine and rules checklist",
  },
  {
    icon: LineChart,
    title: "Trade Journal",
    description: "Log trades with detailed analysis, emotions, and screenshots",
  },
  {
    icon: Shield,
    title: "Risk Monitor",
    description: "Real-time tracking of daily loss limits and position sizes",
  },
  {
    icon: Calendar,
    title: "Performance Analytics",
    description: "Visual insights with calendar heatmaps and detailed charts",
  },
];

const benefits = [
  "Indian market focused (NSE/BSE)",
  "Mobile-first responsive design",
  "Options & futures support",
  "Psychology tracking",
  "Custom rule management",
  "Export & backup data",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">TradeMind</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-hero mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Trade with Discipline.
              <br />
              <span className="text-accent">Track with Precision.</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              TradeMind helps Indian traders maintain discipline through pre-market
              rituals, track every trade with detailed journaling, and monitor risk
              in real-time.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-display mb-4">Everything You Need</h2>
            <p className="text-muted-foreground">
              Built specifically for Indian stock & options traders
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y border-border bg-card/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-display mb-6">
                Built for{" "}
                <span className="text-accent">Indian Traders</span>
              </h2>
              <p className="mb-8 text-muted-foreground">
                TradeMind understands the unique needs of NSE/BSE traders. From
                proper Indian number formatting to IST timezone handling,
                everything is designed with you in mind.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-accent/20 to-accent/5 blur-xl" />
                <div className="relative rounded-xl border border-border bg-card p-8">
                  <div className="mb-4 text-sm text-muted-foreground">
                    Today&apos;s P&amp;L
                  </div>
                  <div className="text-4xl font-bold text-profit">
                    +₹24,580
                  </div>
                  <div className="mt-2 text-sm text-profit">+2.45%</div>
                  <div className="mt-6 flex gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Trades</div>
                      <div className="text-xl font-semibold">5</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                      <div className="text-xl font-semibold">80%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Risk Used</div>
                      <div className="text-xl font-semibold text-warning">45%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-display mb-4">Ready to Trade Better?</h2>
          <p className="mb-8 text-muted-foreground">
            Join traders who are building discipline and improving their
            performance.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <span>TradeMind</span>
          </div>
          <div>Built with discipline for Indian traders</div>
        </div>
      </footer>
    </div>
  );
}
