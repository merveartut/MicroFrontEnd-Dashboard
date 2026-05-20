///home/merve/mfe/apps/shell/src/App.tsx
import React, { Suspense, useEffect } from "react";
import { Card } from "@mfe/ui-library";
import { useSystemStore, useThemeStore } from "@mfe/store";
import ErrorBoundary from "./components/ErrorBoundary";

const FinanceStats = React.lazy(() => import("financeApp/FinanceStats"));
const TrendsChart = React.lazy(() => import("trendsApp/TechTrends"));

function App() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { status } = useSystemStore();
const updateStatus = useSystemStore((state: any) => state.updateStatus)

useEffect(() => {
  const checkMfeHealth = async () => {
    const remotes = [
      {name: "finance", url: "http://localhost:5001/assets/remoteEntry.js"},
      { name: "trends", url: "http://localhost:5002/assets/remoteEntry.js" }

    ]
    for (const mfe of remotes) {
      try {
        const response = await fetch(mfe.url, {
          method: "HEAD",
          cache: "no-store",
          mode: "cors"
        })

        if (response.ok) {
          updateStatus(mfe.name as any, "online")
        } else {
          updateStatus(mfe.name as any, "offline")
        }
      } catch{
        updateStatus(mfe.name as any, "offline")
    }
    } 
  }
  checkMfeHealth()
  const interval = setInterval(checkMfeHealth, 5000)
  return () => clearInterval(interval)
}, [updateStatus])

  const StatusRow = ({ label, state }: { label: string; state: string }) => (
    <div className="flex justify-between items-center text-[11px]">
      <span className="dark:text-slate-400 text-slate-800">{label}</span>
      <span
        className={`flex items-center gap-1.5 font-bold ${
          state === "online"
            ? "text-emerald-400"
            : state === "loading"
              ? "text-amber-400"
              : "text-rose-400"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            state === "online" ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
          }`}
        ></span>
        {state.toUpperCase()}
      </span>
    </div>
  );
  return (
    <div
      className={`${isDarkMode ? "dark" : ""} min-h-screen w-full flex m-0 p-0`}
    >
      <aside className="w-64 bg-slate-900 dark:bg-black text-slate-300 p-6 flex flex-col shrink-0">
        <div className="text-white font-black text-xl mb-12 italic">
          TURBO<span className="text-blue-500">DASH</span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-3"
        >
          {isDarkMode ? "☀️ Işıklı Mod" : "🌙 Karanlık Mod"}
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-10 bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-300">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Somethings on live
          </h1>

          <div className="mt-auto p-4 bg-[#F8FAFC] dark:bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">
              System Health
            </h4>
            <div className="space-y-2">
              <StatusRow label="Finance Service" state={status.finance} />
              <StatusRow label="Tech Trends Service" state={status.trends} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
          <Card title="Market Analysis" badge="Live" subtitle="Exchange rates">
            <ErrorBoundary
            moduleName="finance"
              fallback={
                <div className="p-8 text-center">
                  <p className="text-rose-500 font-bold text-xs uppercase">
                    Connection Failed
                  </p>
                  <p className="text-slate-400 text-[10px] mt-1 italic font-medium">
                    Finance Service Unavailable.
                  </p>
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="p-12 animate-pulse text-slate-400 text-center">
                    Loading...
                  </div>
                }
              >
                <FinanceStats />
              </Suspense>
            </ErrorBoundary>
          </Card>

          <Card
            title="Framework Race"
            badge="Weekly"
            subtitle="GitHub stars count"
          >
            <ErrorBoundary
            moduleName="trends"
              fallback={
                <div className="p-8 text-center">
                  <p className="text-rose-500 font-bold text-xs uppercase">
                     Connection Failed
                  </p>
                  <p className="text-slate-400 text-[10px] mt-1 italic font-medium">
                     Tech Trends Service Unavailable.
                  </p>
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="p-12 animate-pulse text-slate-400 text-center">
                    Analyzing...
                  </div>
                }
              >
                <TrendsChart />
              </Suspense>
            </ErrorBoundary>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
