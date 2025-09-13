import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMusicList } from './api';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ExternalLink, Music, User, Clock, Loader2 } from 'lucide-react';

export const ListMusics: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['musics', page, perPage],
    queryFn: () => getMusicList(page, perPage),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage: string) => {
    setPerPage(Number(newPerPage));
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-lg">Carregando músicas...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p className="text-lg font-medium">Erro ao carregar músicas</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
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
                {data.pagination.total} músicas • Página {data.pagination.page} de {data.pagination.pages}
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
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.musicas?.map((music) => (
                  <TableRow key={music.id}>
                    <TableCell className="font-mono text-sm">{music.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{music.nome || 'Sem nome'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {music.artista || 'Artista desconhecido'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
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
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(music.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={!data.pagination.has_prev}
              >
                Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={!data.pagination.has_next}
              >
                Próximo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

