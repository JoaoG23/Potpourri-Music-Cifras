import { useState, useEffect, useRef, useCallback } from "react";
import { ScrollView } from "react-native";

export const useAutoScroll = (scrollRef: React.RefObject<any>) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const scrollY = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopScrolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startScrolling = useCallback(() => {
    stopScrolling();
    setIsPlaying(true);

    // Ajustamos a frequência e o passo baseado na velocidade
    // Quanto maior a velocidade, maior o passo ou menor o intervalo
    const step = 1;
    const baseInterval = 100;
    const interval = Math.max(16, baseInterval / speed);

    intervalRef.current = setInterval(() => {
      scrollY.current += step;
      if (scrollRef.current?.scrollToOffset) {
        scrollRef.current.scrollToOffset({
          offset: scrollY.current,
          animated: true,
        });
      } else if (scrollRef.current?.scrollTo) {
        scrollRef.current.scrollTo({
          y: scrollY.current,
          animated: true,
        });
      }
    }, interval);
  }, [speed, stopScrolling, scrollRef]);

  const togglePlay = () => {
    if (isPlaying) {
      stopScrolling();
    } else {
      startScrolling();
    }
  };

  const handleScroll = (event: any) => {
    // Sincroniza o scrollY interno se o usuário rolar manualmente
    if (!isPlaying) {
      scrollY.current = event.nativeEvent.contentOffset.y;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startScrolling();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [speed, isPlaying, startScrolling]);

  return {
    isPlaying,
    speed,
    setSpeed,
    togglePlay,
    handleScroll,
  };
};
