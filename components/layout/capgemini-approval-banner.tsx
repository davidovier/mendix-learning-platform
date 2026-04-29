"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const DISMISSED_KEY = "capgemini_approval_dismissed";

export function ApprovalBannerClient() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="border-b border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="text-sm text-green-800 dark:text-green-200">
          <span className="font-medium">🎉 Capgemini access approved!</span>
          {" "}You now have full pro access as a Capgemini colleague.
        </p>
        <button
          onClick={dismiss}
          className="ml-4 shrink-0 rounded p-0.5 text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/40"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
