import { Loader2 } from "lucide-react";

export const Loading: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-6 animate-spin" />
          <span className="text-lg">Carregando músicas...</span>
        </div>
      </div>
    </div>
  );
};
