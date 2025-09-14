import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Loader2, Trash2, ArrowLeft } from "lucide-react";
import { deleteMusic, getMusicById } from "./api";
import { waitTimeAndNavigate } from "@/utils/waitTimeAndNavigate/waitTimeAndNavigate";

export const RemoveMusic: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Buscar dados da música para mostrar informações
  const { data: musicData, isLoading: isLoadingMusic } = useQuery({
    queryKey: ["music", id],
    queryFn: () => getMusicById(Number(id)),
    enabled: !!id,
  });

  const music = musicData?.musica;

  // Mutation para deletar
  const deleteMutation = useMutation({
    mutationFn: () => deleteMusic(Number(id)),
    onSuccess: () => {
      toast.success("Música removida com sucesso!");
      waitTimeAndNavigate(navigate, "/list-musics", 2000);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Erro ao remover música";
      toast.error(errorMessage);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleCancel = () => {
    navigate("/list-musics");
  };

  if (isLoadingMusic) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!music) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">
                Música não encontrada
              </h2>
              <Button onClick={handleCancel} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Lista
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={handleCancel} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-red-600">Remover Música</h1>
      </div>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            Confirmar Exclusão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">
              Você está prestes a remover a música:
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Nome:</strong> {music?.nome}
              </p>
              <p>
                <strong>Artista:</strong> {music?.artista}
              </p>
              <p>
                <strong>ID:</strong> {music?.id}
              </p>
              {music?.link_musica && (
                <p>
                  <strong>Link:</strong>{" "}
                  <a
                    href={music.link_musica}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {music.link_musica}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Atenção:</h4>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Esta ação não pode ser desfeita</li>
              <li>
                • A música será removida de todos os potpourris associados
              </li>
              <li>• A cifra e todos os dados da música serão permanentemente excluídos</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex-1"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Sim, Remover Música
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
