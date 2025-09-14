import { useQuery } from "@tanstack/react-query";
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPotpourriMusics } from "./api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { FloatingControls } from "../../../components/FloatingControls";

export const ViewPotpourri: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["potpourri", id],
    queryFn: () => getPotpourriMusics(Number(id)),
  });
  
  const potpourri = data?.musicas_potpourri;
  
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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold"> Visualizar Potpourri {id}</h1>
      
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      
      {potpourri && potpourri.map((music) => (
        <Card key={music.id}>
          <CardHeader>
            <CardTitle>{music.musica.nome}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Artista:</strong> {music.musica.artista}
              </div>
              <div>
                <strong>Ordem:</strong> {music.ordem_tocagem}
              </div>
              <div>
                <strong>Cifra:</strong>
                <pre className="font-mono text-sm bg-gray-50 p-4 rounded-md mt-2 whitespace-pre-wrap">
                  {music.musica.cifra}
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
