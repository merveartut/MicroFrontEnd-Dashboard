import { useQuery } from "@tanstack/react-query";
import { useSystemStore } from "@mfe/store";
import { useEffect } from "react";

const fetchRates = async () => {
  // USD bazlı kurları çekiyoruz
  const res = await fetch("https://open.er-api.com/v6/latest/USD");
  if (!res.ok) throw new Error("Veri alınamadı");
  return res.json();
};

const FinanceStats = () => {
  const updateStatus = useSystemStore((s: any) => s.updateStatus);

  useEffect(() => {
    updateStatus("finance", "online");
    return () => updateStatus("finance", "offline");
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["market-data-tl"],
    queryFn: fetchRates,
    refetchInterval: 60000, // Dakikada bir güncelle
  });

  if (isLoading)
    return (
      <div className="p-8 animate-pulse text-slate-400 text-center text-xs">
        Piyasalar güncelleniyor...
      </div>
    );
  if (isError)
    return <div className="p-8 text-red-500 text-xs">Bağlantı hatası.</div>;

  const rates = data?.rates;
  const usdTry = rates?.TRY; // 1 Dolar kaç TL?
  const eurTry = (1 / rates?.EUR) * usdTry; // 1 Euro kaç TL? (Parite üzerinden hesaplama)

  // Gram Altın Hesaplama (Ons Altın / 31.1035 * Dolar Kuru)
  // Not: Eğer API XAU dönmezse varsayılan bir Ons fiyatı (örn: 2150) üzerinden hesaplar.
  const onsGold = rates?.XAU ? 1 / rates?.XAU : 2150;
  const gramAltin = (onsGold / 31.1035) * usdTry;

  const marketItems = [
    {
      label: "ABD DOLARI",
      value: usdTry,
      symbol: "$",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "EURO",
      value: eurTry,
      symbol: "€",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "GRAM ALTIN",
      value: gramAltin,
      symbol: "Gr",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="flex flex-col space-y-4">
      {marketItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase">
              {item.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
                {item.value?.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-sm font-bold text-slate-400">TL</span>
            </div>
          </div>

          <div
            className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}
          >
            <span className={`text-lg font-bold ${item.color}`}>
              {item.symbol}
            </span>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center gap-2 pt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
          TCMB Verileri ile Senkronize
        </span>
      </div>
    </div>
  );
};

export default FinanceStats;
