///home/merve/mfe/apps/shell/src/components/ErrorBoundary.tsx
import { useSystemStore } from "@mfe/store";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
  moduleName: "finance" | "trends";
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("Yükleme hatası:", error, errorInfo);
    try {
      // Zustand store'un vanilla JavaScript tetikleyicisini (setState) kullanıyoruz.
      // Class component içinde olsak bile hook'un bu metoduyla store'u doğrudan güncelleyebiliriz.
      useSystemStore.setState((state: any) => ({
        status: {
          ...state.status,
          [this.props.moduleName]: "offline",
        },
      }));
    } catch (storeError) {
      console.error("MFE State güncellenirken hata oluştu:", storeError);
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
