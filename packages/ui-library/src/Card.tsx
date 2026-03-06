import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  subtitle?: string;
  badge?: string;
}

export const Card = ({ title, children, subtitle, badge }: CardProps) => {
  return (
    <article className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-300 flex flex-col h-full min-h-[300px]">
      {(title || badge) && (
        <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-400 dark:text-slate-200 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {badge && (
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600  text-[10px] font-bold rounded-full uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
      )}
      {/* padding (p-6) ekleyerek içeriğin kenarlara yapışmasını engelliyoruz */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </article>
  );
};
