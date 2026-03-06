import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FinanceStats from "./components/FinanceStats";

const queryClient = new QueryClient();

// Modülü sarmalıyoruz
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FinanceStats />
    </QueryClientProvider>
  );
}
