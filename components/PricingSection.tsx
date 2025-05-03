// File: /components/PricingSection.tsx

// import Link from 'next/link';
// import { StripeBuyButton } from './StripeBuyButton';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

// interface PricingSectionProps {
//   showFullDetails?: boolean;
// }

const pricingTiers = [
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    interval: "/month",
    description: "Perfect for small teams and startups",
    features: [
      "All template features",
      "Priority support",
      "Custom branding",
      "Analytics dashboard",
      "Team collaboration"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$49",
    interval: "/month",
    description: "For larger organizations",
    features: [
      "Everything in Pro",
      "Advanced security",
      "Custom integrations",
      "24/7 support",
      "SLA guarantee"
    ],
    cta: "Start Trial",
    popular: true
  },
  {
    id: "custom",
    name: "Custom",
    price: "Custom",
    interval: "",
    description: "Tailored to your needs",
    features: [
      "Custom development",
      "Dedicated support",
      "Custom SLA",
      "On-premise options",
      "Training sessions"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export function PricingSection() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string | null>("enterprise");

  const handleTierClick = (tierId: string) => {
    setSelectedTier(currentTier => currentTier === tierId ? null : tierId);
  };

  const handleCTAClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/profile');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {pricingTiers.map((tier, i) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => handleTierClick(tier.id)}
          className={cn(
            "flex flex-col rounded-xl p-6 shadow-lg transition-all duration-300",
            tier.popular
              ? 'bg-primary/5 ring-2 ring-primary transform scale-105'
              : 'bg-white ring-1 ring-slate-200 hover:ring-primary/50'
          )}
        >
          {/* Show Popular badge only for Enterprise tier */}
          {tier.popular && (
            <span className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 text-sm bg-primary text-white rounded-full">
              Popular
            </span>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900">{tier.name}</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
              <span className="ml-1 text-slate-500">{tier.interval}</span>
            </div>
            <p className="mt-4 text-slate-500">{tier.description}</p>
            <ul role="list" className="mt-6 space-y-4">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            asChild
            className={cn(
              "mt-8 w-full rounded-full py-3 text-center text-lg font-medium transition-colors",
              tier.popular
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            )}
            onClick={handleCTAClick}
          >
            {tier.cta}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}