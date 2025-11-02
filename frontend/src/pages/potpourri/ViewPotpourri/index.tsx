import { useQuery } from "@tanstack/react-query";
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPotpourriMusics } from "./api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { FloatingControls } from "../../../components/FloatingControls";

export const ViewPotpourri: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["potpourri", id],
    queryFn: () => getPotpourriMusics(Number(id)),
  });

  const potpourri = data?.musicas_potpourri;
  const processarLinha = (linha: string) => {
    // Regex para identificar cifras musicais
    const regexCifra =
      /\b([A-G][#b]?(?:m|maj|dim|aug|sus|7M|°)?[0-9]*(?:\/[A-G][#b]?)?)\b/g;

    const partes = [];
    let ultimoIndex = 0;
    let match;

    while ((match = regexCifra.exec(linha)) !== null) {
      // Adiciona o texto antes da cifra
      if (match.index > ultimoIndex) {
        partes.push(
          <span key={`text-${ultimoIndex}`}>
            {linha.substring(ultimoIndex, match.index)}
          </span>
        );
      }

      // Adiciona a cifra colorida
      partes.push(
        <span
          key={`cifra-${match.index}`}
          style={{ color: "#2563eb", fontWeight: "bolder" }}
        >
          {match[0]}
        </span>
      );

      ultimoIndex = match.index + match[0].length;
    }

    // Adiciona o texto restante após a última cifra
    if (ultimoIndex < linha.length) {
      partes.push(
        <span key={`text-${ultimoIndex}`}>{linha.substring(ultimoIndex)}</span>
      );
    }

    return partes.length > 0 ? partes : linha;
  };

  // Função para iniciar o scroll automático
  const startAutoScroll = useCallback(() => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }

    // Velocidade base: 1 pixel por intervalo
    // Intervalo base: 50ms
    // Velocidade do usuário: multiplicador (0.1x a 3.0x)
    const baseSpeed = 1;
    const baseInterval = 50;
    const scrollSpeed = baseSpeed * speed;
    const interval = Math.max(10, baseInterval / speed); // Mínimo 10ms

    const intervalId = setInterval(() => {
      window.scrollBy(0, scrollSpeed);
    }, interval);

    setScrollInterval(intervalId);
  }, [scrollInterval, speed]);

  // Função para parar o scroll automático
  const stopAutoScroll = useCallback(() => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  }, [scrollInterval]);

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    // Se estiver tocando, reiniciar o scroll com nova velocidade
    if (isPlaying) {
      stopAutoScroll();
      setTimeout(() => {
        if (isPlaying) {
          startAutoScroll();
        }
      }, 100);
    }
  };

  const handleBack = () => {
    stopAutoScroll();
    navigate("/list-potpourris");
  };

  // Limpar intervalo quando componente for desmontado
  useEffect(() => {
    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [scrollInterval]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold"> Visualizar Potpourri {id}</h1>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      {potpourri &&
        potpourri.map((music) => (
          <Card key={music.id}>
            <CardHeader className="px-3">
              <CardTitle>{music.musica.nome}</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-4">
                <div>
                  <strong>Artista:</strong> {music.musica.artista}
                </div>
                <div>
                  <strong>Ordem:</strong> {music.ordem_tocagem}
                </div>
                <div>
                  <strong>Cifra:</strong>
                  <pre className="font-mono text-sm bg-gray-50 py-4 rounded-md mt-2 whitespace-pre-wrap">
                    {processarLinha(music.musica.cifra)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

      {/* Controles Flutuantes */}
      <FloatingControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        onBack={handleBack}
        showSaveButton={false}
        minSpeed={0.1}
        maxSpeed={3.0}
        speedStep={0.1}
      />
    </div>
  );
};
