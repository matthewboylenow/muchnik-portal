"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Database, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={16} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { id: "security", label: "Security", icon: <Shield size={16} /> },
    { id: "data", label: "Data Management", icon: <Database size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage your account and platform settings</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors text-left",
                activeTab === tab.id
                  ? "bg-[var(--bg-glass-active)] text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card-static p-6 space-y-6"
            >
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Profile Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Name</label>
                  <input
                    type="text"
                    defaultValue="SEO Admin"
                    className="w-full rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-strong)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Email</label>
                  <input
                    type="email"
                    defaultValue="admin@muchnikelderlaw.com"
                    className="w-full rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-strong)]"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card-static p-6 space-y-4"
            >
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Notification Preferences</h3>
              {[
                { label: "Rank drop alerts (> 5 positions)", defaultChecked: true },
                { label: "Rank improvement alerts", defaultChecked: true },
                { label: "New reviews", defaultChecked: true },
                { label: "Competitor activity", defaultChecked: false },
                { label: "Weekly summary email", defaultChecked: true },
                { label: "Monthly report auto-generation", defaultChecked: true },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={item.defaultChecked}
                    className="h-4 w-4 rounded border-[var(--border-default)] accent-indigo-500"
                  />
                </label>
              ))}
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card-static p-6 space-y-6"
            >
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Current Password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-strong)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">New Password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-strong)]"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                Update Password
              </button>
            </motion.div>
          )}

          {activeTab === "data" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card-static p-6 space-y-4"
            >
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Data Management</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-[var(--bg-surface)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Run Manual Data Collection</p>
                    <p className="text-xs text-[var(--text-muted)]">Trigger all cron jobs immediately</p>
                  </div>
                  <button className="rounded-lg bg-[var(--bg-glass-active)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-glass-hover)] transition-colors">
                    Run Now
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[var(--bg-surface)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Export All Data</p>
                    <p className="text-xs text-[var(--text-muted)]">Download a full data export as CSV</p>
                  </div>
                  <button className="rounded-lg bg-[var(--bg-glass-active)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-glass-hover)] transition-colors">
                    Export
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[var(--bg-surface)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Database Seed</p>
                    <p className="text-xs text-[var(--text-muted)]">Reset database with sample data</p>
                  </div>
                  <button className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition-colors">
                    Seed DB
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
