"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Video, Eye, Clock, ExternalLink, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const locationDotColor: Record<string, string> = {
  manhattan: "#818CF8",
  "staten-island": "#22D3EE",
  "morris-county": "#34D399",
};

const demoBlogPosts = [
  { id: "1", title: "Understanding Medicaid Look-Back Period in NJ", location: "Morris County", locationSlug: "morris-county", published: "Feb 8, 2026", views: 342, page: "Page 1", keyword: "medicaid look-back period nj", url: "#" },
  { id: "2", title: "Estate Planning for Business Owners in NYC", location: "Manhattan", locationSlug: "manhattan", published: "Feb 3, 2026", views: 528, page: "Page 1", keyword: "estate planning business owners", url: "#" },
  { id: "3", title: "Protecting Assets from Nursing Home Costs", location: "Staten Island", locationSlug: "staten-island", published: "Jan 15, 2026", views: 267, page: "Page 2", keyword: "asset protection nursing home", url: "#" },
  { id: "4", title: "What Is Guardianship and When Is It Needed?", location: "Manhattan", locationSlug: "manhattan", published: "Jan 8, 2026", views: 445, page: "Page 1", keyword: "guardianship lawyer nyc", url: "#" },
  { id: "5", title: "Veterans Benefits for Long-Term Care in NJ", location: "Morris County", locationSlug: "morris-county", published: "Dec 20, 2025", views: 198, page: "Page 2", keyword: "veterans benefits long term care nj", url: "#" },
];

const demoVideos = [
  { id: "v1", title: "When to Start Elder Law Planning", thumbnail: "", views: 890, avgWatch: "4:32", platform: "YouTube", url: "#" },
  { id: "v2", title: "5 Things to Know About Medicaid in New York", thumbnail: "", views: 654, avgWatch: "3:18", platform: "YouTube", url: "#" },
  { id: "v3", title: "Estate Planning Basics Explained", thumbnail: "", views: 423, avgWatch: "5:01", platform: "YouTube", url: "#" },
];

const upcomingContent = [
  { title: "How to Choose an Elder Law Attorney", date: "Feb 20, 2026", type: "blog" },
  { title: "Medicaid Application Process Walk-Through", date: "Feb 25, 2026", type: "video" },
  { title: "Special Needs Trust Explained", date: "Mar 5, 2026", type: "blog" },
];

export default function PortalContent() {
  const [tab, setTab] = useState<"blog" | "videos">("blog");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Your Content</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">See how your blog posts and videos are performing</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] p-1 w-fit">
        <button
          onClick={() => setTab("blog")}
          className={cn(
            "flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-all",
            tab === "blog"
              ? "bg-[var(--bg-glass-active)] text-[var(--text-primary)]"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          )}
        >
          <FileText size={14} /> Blog Posts
        </button>
        <button
          onClick={() => setTab("videos")}
          className={cn(
            "flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-all",
            tab === "videos"
              ? "bg-[var(--bg-glass-active)] text-[var(--text-primary)]"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          )}
        >
          <Video size={14} /> Videos
        </button>
      </div>

      {/* Blog Posts Tab */}
      {tab === "blog" && (
        <div className="grid grid-cols-1 gap-4">
          {demoBlogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card-static p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: locationDotColor[post.locationSlug] }} />
                      {post.location}
                    </span>
                    <span>Published {post.published}</span>
                  </div>
                </div>
                <a href={post.url} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  <ExternalLink size={16} />
                </a>
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Eye size={14} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{post.views.toLocaleString()} people read this</span>
                </div>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  post.page === "Page 1"
                    ? "bg-[var(--color-positive)]/10 text-[var(--color-positive)]"
                    : "bg-[var(--bg-surface)] text-[var(--text-muted)]"
                )}>
                  Appears on Google {post.page}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Videos Tab */}
      {tab === "videos" && (
        <div className="grid grid-cols-3 gap-4">
          {demoVideos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-static overflow-hidden"
            >
              <div className="aspect-video bg-[var(--bg-surface)] flex items-center justify-center">
                <Video size={40} className="text-[var(--text-muted)]" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{video.title}</h3>
                <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> Watched {video.views} times
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> Avg {video.avgWatch}
                  </span>
                </div>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)]">
                  {video.platform}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upcoming Content */}
      <div className="glass-card-static p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Calendar size={18} /> Coming Up
        </h3>
        <div className="space-y-3">
          {upcomingContent.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-[var(--bg-surface)] p-3">
              <div className="flex items-center gap-3">
                {item.type === "blog" ? (
                  <FileText size={16} className="text-indigo-400" />
                ) : (
                  <Video size={16} className="text-cyan-400" />
                )}
                <span className="text-sm text-[var(--text-secondary)]">{item.title}</span>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
