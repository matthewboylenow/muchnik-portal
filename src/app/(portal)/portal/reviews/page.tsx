"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { LocationCard } from "@/components/shared/LocationCard";
import { TrafficOverview } from "@/components/charts/TrafficOverview";
import { useLocationData } from "@/hooks/useLocationData";
import { cn } from "@/lib/utils";

const demoReviews = [
  { id: "1", name: "Sarah M.", rating: 5, text: "Kirill was incredibly thorough and explained everything about our mother's Medicaid application. He made a stressful process manageable.", date: "Feb 5, 2026", location: "Morris County", locationSlug: "morris-county", platform: "Google", responded: true, response: "Thank you so much, Sarah! It was a pleasure working with your family." },
  { id: "2", name: "Robert K.", rating: 5, text: "Excellent service for our family's estate planning needs. Very professional and knowledgeable.", date: "Jan 22, 2026", location: "Manhattan", locationSlug: "manhattan", platform: "Google", responded: true, response: "Thank you Robert! We appreciate your kind words." },
  { id: "3", name: "Linda P.", rating: 4, text: "Very professional and knowledgeable about elder law matters. Took the time to answer all our questions.", date: "Jan 10, 2026", location: "Manhattan", locationSlug: "manhattan", platform: "Google", responded: false, response: null },
  { id: "4", name: "James T.", rating: 5, text: "Helped us navigate a complex guardianship situation. Highly recommend!", date: "Jan 5, 2026", location: "Staten Island", locationSlug: "staten-island", platform: "Google", responded: true, response: "Thank you James! We're glad we could help." },
  { id: "5", name: "Maria G.", rating: 5, text: "The best elder law attorney in NJ. Kirill handled our Medicaid planning with expertise and compassion.", date: "Dec 28, 2025", location: "Morris County", locationSlug: "morris-county", platform: "Avvo", responded: false, response: null },
  { id: "6", name: "David L.", rating: 4, text: "Great experience overall. The office was responsive and the advice was sound.", date: "Dec 15, 2025", location: "Manhattan", locationSlug: "manhattan", platform: "Google", responded: true, response: "Thank you David! We value your feedback." },
];

const locationDotColor: Record<string, string> = {
  manhattan: "#818CF8",
  "staten-island": "#22D3EE",
  "morris-county": "#34D399",
};

const demoReviewTrend = Array.from({ length: 6 }, (_, i) => ({
  date: new Date(2025, 8 + i, 1).toLocaleDateString("en-US", { month: "short" }),
  total: 2 + Math.floor(Math.random() * 4),
}));

export default function PortalReviews() {
  const { data: locationData } = useLocationData();

  const overallAvg = locationData.length
    ? (locationData.reduce((sum, l) => sum + l.avgRating, 0) / locationData.length).toFixed(1)
    : "0";

  const totalReviews = locationData.reduce((sum, l) => sum + l.reviewCount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Your Reviews</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">See what your clients are saying about you</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card-static p-5 text-center">
          <div className="flex justify-center mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} className={i < Math.floor(parseFloat(overallAvg)) ? "text-amber-400 fill-amber-400" : "text-[var(--text-muted)]"} />
            ))}
          </div>
          <p className="font-mono text-2xl font-bold text-[var(--text-primary)]">{overallAvg}</p>
          <p className="text-xs text-[var(--text-muted)]">Overall Rating</p>
        </div>
        {locationData.map((loc) => (
          <div key={loc.slug} className="glass-card-static p-5 text-center">
            <div className="flex justify-center gap-1 mb-2">
              <span className="h-2 w-2 rounded-full mt-1" style={{ backgroundColor: locationDotColor[loc.slug] }} />
              <span className="text-xs text-[var(--text-muted)]">{loc.name}</span>
            </div>
            <p className="font-mono text-2xl font-bold text-[var(--text-primary)]">{loc.avgRating}</p>
            <p className="text-xs text-[var(--text-muted)]">{loc.reviewCount} reviews</p>
          </div>
        ))}
      </div>

      {/* Review Trend */}
      <TrafficOverview data={demoReviewTrend} mode="total" title="New Reviews Per Month" height={200} />

      {/* Review Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">All Reviews</h3>
        {demoReviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-static p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--text-primary)]">{review.name}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className={j < review.rating ? "text-amber-400 fill-amber-400" : "text-[var(--text-muted)]"} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: locationDotColor[review.locationSlug] }} />
                    {review.location}
                  </span>
                  <span>{review.date}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)]">{review.platform}</span>
                </div>
              </div>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                review.responded
                  ? "bg-[var(--color-positive)]/10 text-[var(--color-positive)]"
                  : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
              )}>
                {review.responded ? "Responded" : "Needs Response"}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{review.text}</p>
            {review.responded && review.response && (
              <div className="mt-3 ml-4 pl-3 border-l-2 border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">Your response:</p>
                <p className="text-sm text-[var(--text-tertiary)]">{review.response}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Review Tips */}
      <div className="glass-card-static p-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <ThumbsUp size={16} className="text-indigo-400" />
          Want More 5-Star Reviews?
        </h3>
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <p>Here are some simple ways to encourage satisfied clients to leave a review:</p>
          <ul className="list-disc list-inside space-y-1 text-[var(--text-tertiary)] ml-2">
            <li>Send a follow-up email after a successful case with a direct link to your Google profile</li>
            <li>Add a &ldquo;Review Us&rdquo; link to your email signature</li>
            <li>Mention reviews casually at the end of a positive client meeting</li>
            <li>Respond promptly to all existing reviews — it shows you care</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
