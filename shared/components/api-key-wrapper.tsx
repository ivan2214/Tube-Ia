import { ApiKeyModal } from "./api-key-modal";
import { getApiKey } from "../actions/api-key-actions";

interface ApiKeyWrapperProps {
  children: React.ReactNode;
  error?: string | null;
}

export async function ApiKeyWrapper({ children, error }: ApiKeyWrapperProps) {
  const { apiKey } = await getApiKey();
  const hasApiKey = !!apiKey;

  return (
    <>
      {children}
      <ApiKeyModal error={error} hasApiKey={hasApiKey} />
    </>
  );
}
