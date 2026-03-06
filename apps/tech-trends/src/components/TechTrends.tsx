import { useQuery } from "@tanstack/react-query";
import { useSystemStore } from "@mfe/store";
import { useEffect } from "react";

const fetchRepoData = async (repo: string) => {
  const res = await fetch(`https://api.github.com/repos/${repo}`);
  if (!res.ok) throw new Error("API hatası");
  return res.json();
};

const TechTrends = () => {
  const updateStatus = useSystemStore((s) => s.updateStatus);

  useEffect(() => {
    updateStatus("trends", "online");
    return () => updateStatus("trends", "offline");
  }, []);

  const repos = ["facebook/react", "vuejs/core", "angular/angular"];
  const results = useQuery({
    queryKey: ["github-stars"],
    queryFn: () => Promise.all(repos.map(fetchRepoData)),
    staleTime: 1000 * 60 * 5,
  });

  if (results.isLoading)
    return (
      <div className="p-8 animate-pulse text-slate-400">
        Veriler senkronize ediliyor...
      </div>
    );
  if (results.isError)
    return <div className="p-8 text-red-500 text-xs">Veri çekilemedi.</div>;

  const data = results.data?.map((repo) => ({
    name: repo.name.charAt(0).toUpperCase() + repo.name.slice(1),
    val: Math.min((repo.stargazers_count / 250000) * 100, 100),
    stars: `${(repo.stargazers_count / 1000).toFixed(0)}k`,
    color: repo.name.includes("react")
      ? "bg-sky-400"
      : repo.name.includes("core")
        ? "bg-emerald-500"
        : "bg-red-500",
  }));
  return (
    <div className="p-6 h-full">
      <h3 className="text-slate-500 dark:text-slate-200 font-semibold uppercase text-xs tracking-wider mb-6">
        GitHub Framework Yarışı
      </h3>
      <div className="space-y-6">
        {data?.map((t) => (
          <div key={t.name}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {t.name}
              </span>
              <span className="text-slate-400 dark:text-slate-300 text-[10px] font-mono">
                {t.stars} STARS
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${t.color} transition-all duration-1000 ease-out`}
                style={{ width: `${t.val}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechTrends;
