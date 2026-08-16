import { useState, useEffect, useRef, useCallback } from "react";

export const useAutoScroll = (referenciaComponenteScroll: React.RefObject<any>) => {
  const [estaExecutandoRolamento, setEstaExecutandoRolamento] = useState<boolean>(false);
  const [velocidadeRolamentoAtual, setVelocidadeRolamentoAtual] = useState<number>(1.0);

  const referenciaPosicaoScrollY = useRef<number>(0);
  const referenciaIdentificadorIntervalo = useRef<NodeJS.Timeout | null>(null);
  const referenciaVelocidadeRolamento = useRef<number>(velocidadeRolamentoAtual);
  referenciaVelocidadeRolamento.current = velocidadeRolamentoAtual;

  // Para a execução do rolamento automático
  const pararRolamentoAutomatico = useCallback(() => {
    if (referenciaIdentificadorIntervalo.current) {
      clearInterval(referenciaIdentificadorIntervalo.current);
      referenciaIdentificadorIntervalo.current = null;
    }
    setEstaExecutandoRolamento(false);
  }, []);

  // Inicia o rolamento automático contínuo
  const iniciarRolamentoAutomatico = useCallback(
    (velocidadeDesejada?: number) => {
      if (referenciaIdentificadorIntervalo.current) {
        clearInterval(referenciaIdentificadorIntervalo.current);
        referenciaIdentificadorIntervalo.current = null;
      }

      setEstaExecutandoRolamento(true);

      const velocidadeEfetiva =
        velocidadeDesejada !== undefined
          ? velocidadeDesejada
          : referenciaVelocidadeRolamento.current || 1.0;

      // Taxa de atualização fluida (~40fps) e passo proporcional à velocidade
      const intervaloMilissegundos = 25;
      const taxaPassoPorTick = Math.max(0.4, Number((velocidadeEfetiva * 0.9).toFixed(2)));

      referenciaIdentificadorIntervalo.current = setInterval(() => {
        referenciaPosicaoScrollY.current += taxaPassoPorTick;

        if (referenciaComponenteScroll.current?.scrollToOffset) {
          referenciaComponenteScroll.current.scrollToOffset({
            offset: referenciaPosicaoScrollY.current,
            animated: false,
          });
        } else if (referenciaComponenteScroll.current?.scrollTo) {
          referenciaComponenteScroll.current.scrollTo({
            y: referenciaPosicaoScrollY.current,
            animated: false,
          });
        }
      }, intervaloMilissegundos);
    },
    [referenciaComponenteScroll]
  );

  // Alterna entre Iniciar e Pausar o rolamento automático
  const alternarEstadoRolamentoAutomatico = () => {
    if (estaExecutandoRolamento) {
      pararRolamentoAutomatico();
    } else {
      iniciarRolamentoAutomatico(velocidadeRolamentoAtual);
    }
  };

  // Trata e sincroniza a posição quando o usuário rola manualmente na tela
  const tratarEventoRolamentoManual = (eventoRolamentoNativo: any) => {
    const deslocamentoVerticalNativo =
      eventoRolamentoNativo?.nativeEvent?.contentOffset?.y;

    if (
      deslocamentoVerticalNativo !== undefined &&
      !isNaN(deslocamentoVerticalNativo)
    ) {
      // Se não estiver executando rolamento automático, sincroniza a posição com o gesto do usuário
      if (!estaExecutandoRolamento) {
        referenciaPosicaoScrollY.current = deslocamentoVerticalNativo;
      }
    }
  };

  // Atualiza dinamicamente o intervalo quando a velocidade mudar durante a execução
  useEffect(() => {
    if (estaExecutandoRolamento) {
      iniciarRolamentoAutomatico(velocidadeRolamentoAtual);
    }

    return () => {
      if (referenciaIdentificadorIntervalo.current) {
        clearInterval(referenciaIdentificadorIntervalo.current);
      }
    };
  }, [velocidadeRolamentoAtual, estaExecutandoRolamento, iniciarRolamentoAutomatico]);

  return {
    isPlaying: estaExecutandoRolamento,
    speed: velocidadeRolamentoAtual,
    setSpeed: setVelocidadeRolamentoAtual,
    togglePlay: alternarEstadoRolamentoAutomatico,
    handleScroll: tratarEventoRolamentoManual,
  };
};
