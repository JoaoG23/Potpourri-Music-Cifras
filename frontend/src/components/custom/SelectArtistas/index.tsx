import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { User } from "lucide-react";
import { getArtistas } from "./api";

interface SelectArtistasProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const SelectArtistas: React.FC<SelectArtistasProps> = ({
  value,
  onValueChange,
  placeholder = "Filtrar por artista",
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["artistas"],
    queryFn: getArtistas,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  return (
    <div className="flex flex-col gap-1">
      <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
        <SelectTrigger className="w-56">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400 shrink-0" />
            <SelectValue placeholder={isLoading ? "Carregando..." : placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos os artistas</SelectItem>
          {data?.artistas.map((artista) => (
            <SelectItem key={artista} value={artista}>
              {artista}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {data?.total !== undefined && (
        <span className="text-xs text-muted-foreground pl-1">
          {data.total} artista{data.total !== 1 ? "s" : ""} cadastrado{data.total !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
};
