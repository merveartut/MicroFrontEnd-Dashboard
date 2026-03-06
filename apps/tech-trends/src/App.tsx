import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TechTrends from "./components/TechTrends";

const queryClient = new QueryClient();

// Modülü sarmalıyoruz
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TechTrends />
    </QueryClientProvider>
  );
}
