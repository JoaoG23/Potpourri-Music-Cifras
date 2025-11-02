import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink,
  Music,
  User,
  Clock,
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

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
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";

import { Loading } from "../../../components/custom/Loading";
import { Error } from "../../../components/custom/Error";
import { Pagination } from "../../../components/custom/Pagination";

import { getMusicList, searchMusicList } from "./api";

export const ListMusics: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const shouldSearch = debouncedSearchTerm.length >= 3;

  const { data, isLoading, error } = useQuery({
    queryKey: ["musics", { page, perPage, debouncedSearchTerm }],
    queryFn: () =>
      shouldSearch
        ? searchMusicList(debouncedSearchTerm, page, perPage)
        : getMusicList(page, perPage),
    refetchOnWindowFocus: true,
  });

  const handlePerPageChange = (newPerPage: string) => {
    setPerPage(Number(newPerPage));
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  if (error) {
    return <Error message={error?.message || ""} />;
  }
  const existsMoreThanOnePage =
    data?.pagination?.pages && data?.pagination?.pages > 1;

  const totalPages: number = data?.pagination?.pages || 1;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Lista de Músicas
            </CardTitle>
            <Button
              onClick={() => navigate("/add-music")}
              style={{ backgroundColor: "#3b11e0", borderColor: "#3b11e0" }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Música
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Pesquisar por música ou artista (mín. 4 caracteres)..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            {shouldSearch && (
              <p className="text-sm text-gray-600 mt-2">
                Pesquisando por:{" "}
                <span className="font-medium">"{debouncedSearchTerm}"</span>
              </p>
            )}
          </div>

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
                {shouldSearch ? (
                  <>
                    {data?.pagination?.total} resultado(s) para "
                    {debouncedSearchTerm}" • Página {data?.pagination?.page} de{" "}
                    {totalPages}
                  </>
                ) : (
                  <>
                    {data?.pagination?.total} músicas • Página{" "}
                    {data?.pagination?.page} de {totalPages}
                  </>
                )}
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
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.musicas?.map((music) => (
                  <TableRow key={music.id}>
                    <TableCell className="font-mono text-sm">
                      {music.id}
                    </TableCell>
                    <TableCell>
                      <Link to={`/update-music/${music.id}`}>
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-gray-400" />
                          <span className="font-medium ">
                            {music.nome || "Sem nome"}
                          </span>
                        </div>
                      </Link>
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/update-music/${music.id}`);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/list-musics/remove/${music.id}`);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {isLoading && <Loading />}
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
