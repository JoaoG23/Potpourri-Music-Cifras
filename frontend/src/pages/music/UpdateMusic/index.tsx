import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Error } from "../../../components/custom/Error";
import { toast } from "sonner";
import {
  Music as MusicIcon,
  User,
  Clock,
  ExternalLink,
} from "lucide-react";

import { getMusicById, updateMusic } from "./api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Loading } from "../../../components/custom/Loading";
import { ChordTextarea } from "./components/ChordTextarea";
import { FloatingControls } from "../../../components/FloatingControls";

import type { Music } from "../types/Music";

import { waitTimeAndNavigate } from "../../../utils/waitTimeAndNavigate/waitTimeAndNavigate";

type MusicFormData = {
  link_musica: string;
  cifra: string;
  velocidade_rolamento: number;
};

interface MusicDataResponse {
  musica: Music;
}
export const UpdateMusic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estado para controlar o componente flutuante
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MusicFormData>({
    defaultValues: {
      link_musica: "",
      cifra: "",
      velocidade_rolamento: 1.0,
    },
  });

  // Query para buscar a música pelo ID
  const {
    data: musicData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["music", id],
    queryFn: () => getMusicById(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const musicDataResponse: MusicDataResponse =
    musicData as unknown as MusicDataResponse;
  const music = useMemo(
    () => musicDataResponse?.musica || ({} as MusicDataResponse),
    [musicDataResponse]
  );

  // Monitorar a velocidade de rolamento
  const velocidadeRolamento = watch("velocidade_rolamento");

  // Funções para o scroll automático
  const startAutoScroll = useCallback(() => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }

    // Velocidade base: 1 pixel por intervalo
    // Intervalo base: 50ms
    // Velocidade do usuário: multiplicador (0.1x a 3.0x)
    const baseSpeed = 1;
    const baseInterval = 50;
    const speed = baseSpeed * velocidadeRolamento;
    const interval = Math.max(10, baseInterval / velocidadeRolamento); // Mínimo 10ms

    const intervalId = setInterval(() => {
      window.scrollBy(0, speed);
    }, interval);

    setScrollInterval(intervalId);
  }, [scrollInterval, velocidadeRolamento]);

  const stopAutoScroll = useCallback(() => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  }, [scrollInterval]);

  // Mutation para atualizar a música
  const updateMutation = useMutation({
    mutationFn: (data: MusicFormData) => updateMusic(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["music", id] });
      queryClient.invalidateQueries({ queryKey: ["musics"] });

      waitTimeAndNavigate(navigate, "/list-musics", 2000);
      toast.success("Música atualizada com sucesso!");
    },
    onError: (error: Error) => {
      const errorMessage = error?.message || "Erro desconhecido";
      toast.error("Erro ao atualizar música: " + errorMessage);
    },
  });

  useEffect(() => {
    if (music) {
      reset({
        link_musica: music.link_musica || "",
        cifra: music.cifra || "",
        velocidade_rolamento: music.velocidade_rolamento || 1.0,
      });
    }
  }, [music, reset]);

  // Limpar intervalo quando componente for desmontado
  useEffect(() => {
    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [scrollInterval]);


  // Parar scroll automático quando usuário interagir manualmente
  useEffect(() => {
    const handleUserScroll = () => {
      if (isPlaying) {
        stopAutoScroll();
        setIsPlaying(false);
        toast.info("Scroll automático pausado - interação manual detectada");
      }
    };

    const handleUserInteraction = () => {
      if (isPlaying) {
        stopAutoScroll();
        setIsPlaying(false);
        toast.info("Scroll automático pausado - interação detectada");
      }
    };

    if (isPlaying) {
      window.addEventListener('wheel', handleUserScroll, { passive: true });
      window.addEventListener('touchstart', handleUserInteraction, { passive: true });
      window.addEventListener('keydown', handleUserInteraction);
    }

    return () => {
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isPlaying, stopAutoScroll]);

  const onSubmit: SubmitHandler<MusicFormData> = (data) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate("/list-musics");
  };

  // Funções para o componente flutuante
  const handlePlayPause = () => {
    if (isPlaying) {
      stopAutoScroll();
      toast.info("Pausado");
    } else {
      startAutoScroll();
      toast.info("Reproduzindo");
    }
    setIsPlaying(!isPlaying);
  };

  // Função para atualizar velocidade quando slider mudar
  const handleSliderChange = () => {
    // Se estiver tocando, recriar o scroll com nova velocidade
    if (isPlaying) {
      stopAutoScroll();
      // Usar setTimeout para evitar conflitos
      setTimeout(() => {
        startAutoScroll();
      }, 10);
    }
  };

  const handleSaveFromFloating = () => {
    // Dispara o submit do formulário
    const form = document.querySelector("form");
    if (form) {
      form.requestSubmit();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error
        message={error instanceof Error ? error.message : "Erro desconhecido"}
      />
    );
  }

  return (
    <div className="container mx-auto p-1 lg:p-4 md:p-6 space-y-4 md:space-y-6">
      <Card className="px-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MusicIcon className="h-5 w-5" />
              <span className="text-lg font-semibold">Editar Cifra</span>
            </div>
          </div>
          <div className="mt-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {music.nome}
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              {music.artista}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Configurações */}
            <div className="space-y-2">
              <Label htmlFor="link_musica">Link da Cifra</Label>
              <Input
                id="link_musica"
                type="url"
                {...register("link_musica", {
                  required: "Link da cifra é obrigatório",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Digite uma URL válida",
                  },
                })}
                placeholder="https://exemplo.com/cifra"
              />
              {errors.link_musica && (
                <span className="text-sm text-red-500">
                  {errors.link_musica.message}
                </span>
              )}
            </div>

            {/* Textarea para cifra - Destacado */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="cifra"
                  className="text-lg font-semibold text-gray-900"
                >
                  Cifra da Música
                </Label>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Foco Principal
                </span>
              </div>
              <ChordTextarea
                id="cifra"
                value={watch("cifra")}
                onChange={(value) => {
                  // Atualizar o valor do formulário
                  const event = {
                    target: { name: "cifra", value }
                  } as React.ChangeEvent<HTMLTextAreaElement>;
                  register("cifra").onChange(event);
                }}
                placeholder="Cole aqui a cifra completa da música com acordes e letra..."
                rows={18}
                className="font-mono text-sm border-2 border-blue-200 focus:border-blue-500 transition-colors resize-none w-full"
                name="cifra"
              />
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                💡 <strong>Dica:</strong> Cole aqui a cifra completa da música.
                Use formatação padrão de cifras com acordes acima das palavras.
                Esta é a parte mais importante da aplicação!
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">
            Informações da Música
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span>
                Criado em:{" "}
                {new Date(music.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                Atualizado em:{" "}
                {new Date(music.updated_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-gray-400" />
              <a
                href={music.link_musica}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ver Cifra Original
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Componente Flutuante */}
      <FloatingControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        speed={watch("velocidade_rolamento")}
        onSpeedChange={(speed) => {
          setValue("velocidade_rolamento", speed);
          handleSliderChange();
        }}
        onSave={handleSaveFromFloating}
        onBack={handleCancel}
        isSaving={updateMutation.isPending}
        minSpeed={0.1}
        maxSpeed={3.0}
        speedStep={0.1}
      />
    </div>
  );
};
