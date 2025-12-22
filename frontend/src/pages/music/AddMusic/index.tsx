
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Music, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

import { createMusic } from "./api";
import type { AddMusicRequest } from "../types/Music";
import { waitTimeAndNavigate } from "../../../utils/waitTimeAndNavigate/waitTimeAndNavigate";

interface MusicFormData {
  link_musica: string;
}

export const AddMusic: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MusicFormData>({
    defaultValues: {
      link_musica: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: AddMusicRequest) => createMusic(data),
    onSuccess: () => {
      toast.success("Música adicionada com sucesso!");
      reset();
      waitTimeAndNavigate(navigate, "/list-musics", 2000);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Erro ao adicionar música";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: MusicFormData) => {
    createMutation.mutate({
      link_musica: data.link_musica,
    });
  };

  const handleCancel = () => {
    navigate("/list-musics");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-center gap-4">
   
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Music className="h-6 w-6" />
          Adicionar Nova Música
        </h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informações da Música</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Link da Música */}
            <div className="space-y-2">
              <Label htmlFor="link_musica">Link da Música *</Label>
              <Input
                id="link_musica"
                {...register("link_musica", {
                  required: "Link da música é obrigatório",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Digite um link válido (http:// ou https://)",
                  },
                })}
                placeholder="https://www.cifraclub.com.br/artista/musica"
                className={errors.link_musica ? "border-red-500" : ""}
              />
              {errors.link_musica && (
                <p className="text-sm text-red-500">{errors.link_musica.message}</p>
              )}
              <p className="text-xs text-orange-400">
                Cole aqui o link da música do CifraClub
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1"
                style={{ backgroundColor: '#3b11e0', borderColor: '#3b11e0' }}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <Music className="h-4 w-4 mr-2" />
                    Adicionar Música
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
