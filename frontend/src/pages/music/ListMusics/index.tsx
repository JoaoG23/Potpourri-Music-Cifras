import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Music, User, Clock } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { Loading } from "../components/others/Loading";
import { Error } from "../components/others/Error";
import { Pagination } from "../components/others/Pagination";

import { getMusicList } from "./api";

export const ListMusics: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["musics", page, perPage],
    queryFn: () => getMusicList(page, perPage),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const handlePerPageChange = (newPerPage: string) => {
    setPerPage(Number(newPerPage));
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error?.message || ""} />;
  }
  const existsMoreThanOnePage =
    data?.pagination?.pages && data?.pagination?.pages > 1;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Lista de Músicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Itens por página:</span>
              <Select
                value={perPage.toString()}
                onValueChange={handlePerPageChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {data?.pagination && (
              <div className="text-sm text-gray-600">
                {data?.pagination?.total} músicas • Página{" "}
                {data?.pagination?.page} de {data?.pagination?.pages}
              </div>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Música</TableHead>
                  <TableHead>Artista</TableHead>
                  <TableHead>Velocidade</TableHead>
                  <TableHead>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.musicas?.map((music) => (
                  <TableRow
                    key={music.id}
                    onClick={() => navigate(`/update-music/${music.id}`)}
                  >
                    <TableCell className="font-mono text-sm">
                      {music.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-gray-400" />
                        <span className="font-medium ">
                          {music.nome || "Sem nome"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {music.artista || "Artista desconhecido"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 w-fit"
                      >
                        <Clock className="h-3 w-3" />
                        {music.velocidade_rolamento || 1.0}x
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={music.link_musica}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm">Ver Cifra</span>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {existsMoreThanOnePage && (
            <Pagination page={page} setPage={setPage} data={data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
