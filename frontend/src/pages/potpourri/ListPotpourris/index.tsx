import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Music, Calendar, Clock, Plus, Eye, Trash2, Pencil, Search } from "lucide-react";

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

import { getPotpourriList, searchPotpourriList } from "./api";

export const ListPotpourris: React.FC = () => {
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
    queryKey: ["potpourris", { page, perPage, debouncedSearchTerm }],
    queryFn: () =>
      shouldSearch
        ? searchPotpourriList(debouncedSearchTerm, page, perPage)
        : getPotpourriList(page, perPage),
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };


  if (error) {
    return <Error message={error?.message || ""} />;
  }

  const existsMoreThanOnePage =
    data?.pagination?.pages && data?.pagination?.pages > 1;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Lista de Potpourris
            </CardTitle>
            <Button onClick={() => navigate("/add-potpourri")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Potpourri
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
                placeholder="Pesquisar por potpourri (mín. 3 caracteres)..."
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
                {data?.pagination?.total} potpourris • Página{" "}
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
                  <TableHead>Nome do Potpourri</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.potpourri?.map((potpourri) => (
                  <TableRow
                    key={potpourri.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="font-mono text-sm">
                      {potpourri.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {potpourri.nome_potpourri}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(potpourri.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {formatDate(potpourri.updated_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/update-potpourri/${potpourri.id}`);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/view-potpourri/${potpourri.id}`);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/list-potpourris/remove/${potpourri.id}`);
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
