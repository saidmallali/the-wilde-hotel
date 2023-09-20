import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";
import { Settings } from "../../entities/Settings";

export function useSettings(): {
  settings: Settings;
  isLoading: boolean;
  error: unknown;
} {
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  return { settings, isLoading, error };
}
