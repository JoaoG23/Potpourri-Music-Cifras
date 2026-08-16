import { useQuery } from "@tanstack/react-query";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPotpourriMusics } from "./api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ExternalLink, Music2, User, Hash } from "lucide-react";
import { FloatingControls } from "../../../components/FloatingControls";
import { FloatingMusicTracker } from "./components";
import type { MusicaPotpourriWithDetails } from "../../../types/potpourri";

export const ViewPotpourri: React.FC = () => {
  const { id: parametroIdentificadorPotpourri } = useParams();
  const navegarParaRota = useNavigate();

  const [
    estaExecutandoRolamentoAutomatico,
    setEstaExecutandoRolamentoAutomatico,
  ] = useState<boolean>(false);
  const [velocidadeRolamentoAtual, setVelocidadeRolamentoAtual] =
    useState<number>(1.0);
  const [indiceMusicaAtiva, setIndiceMusicaAtiva] = useState<number>(0);
  const [
    identificadorIntervaloRolamento,
    setIdentificadorIntervaloRolamento,
  ] = useState<NodeJS.Timeout | null>(null);

  const referenciaVelocidadeRolamento = useRef<number>(velocidadeRolamentoAtual);
  referenciaVelocidadeRolamento.current = velocidadeRolamentoAtual;

  const {
    data: dadosRequisicaoPotpourri,
    isLoading: estaCarregandoDadosPotpourri,
    error: erroCarregamentoPotpourri,
  } = useQuery({
    queryKey: ["potpourri", parametroIdentificadorPotpourri],
    queryFn: () => getPotpourriMusics(Number(parametroIdentificadorPotpourri)),
  });

  const listaMusicasPotpourri: MusicaPotpourriWithDetails[] =
    dadosRequisicaoPotpourri?.musicas_potpourri || [];

  // Formatação e estilização de acordes e texto da cifra
  const formatarLinhaCifraComCores = (linhaTextoCifra: string) => {
    if (!linhaTextoCifra) {
      return "";
    }

    const expressaoRegularCifra =
      /\b([A-G][#b]?(?:m|maj|dim|aug|sus|7M|°)?[0-9]*(?:\/[A-G][#b]?)?)\b/g;

    const partesLinhaFormatada: (string | React.JSX.Element)[] = [];
    let ultimoIndiceProcessado = 0;
    let correspondenciaRegex: RegExpExecArray | null = null;

    while (
      (correspondenciaRegex = expressaoRegularCifra.exec(linhaTextoCifra)) !==
      null
    ) {
      const indiceInicioCifra = correspondenciaRegex.index;
      const textoCifraEncontrada = correspondenciaRegex[0];

      // Adiciona o texto antes da cifra
      if (indiceInicioCifra > ultimoIndiceProcessado) {
        partesLinhaFormatada.push(
          <span
            key={`texto-antes-${ultimoIndiceProcessado}`}
            className="inline text-gray-800 dark:text-gray-200"
          >
            {linhaTextoCifra.substring(
              ultimoIndiceProcessado,
              indiceInicioCifra
            )}
          </span>
        );
      }

      // Adiciona a cifra com destaque visual
      partesLinhaFormatada.push(
        <span
          key={`cifra-destaque-${indiceInicioCifra}`}
          className="inline-block font-extrabold text-blue-600 dark:text-blue-400 select-text"
        >
          {textoCifraEncontrada}
        </span>
      );

      ultimoIndiceProcessado =
        indiceInicioCifra + textoCifraEncontrada.length;
    }

    // Adiciona o restante da linha após a última cifra encontrada
    if (ultimoIndiceProcessado < linhaTextoCifra.length) {
      partesLinhaFormatada.push(
        <span
          key={`texto-restante-${ultimoIndiceProcessado}`}
          className="inline text-gray-800 dark:text-gray-200"
        >
          {linhaTextoCifra.substring(ultimoIndiceProcessado)}
        </span>
      );
    }

    if (partesLinhaFormatada.length === 0) {
      return linhaTextoCifra;
    }

    return partesLinhaFormatada;
  };

  // Parar o scroll automático
  const pararRolamentoAutomatico = useCallback(() => {
    if (!identificadorIntervaloRolamento) {
      return;
    }
    clearInterval(identificadorIntervaloRolamento);
    setIdentificadorIntervaloRolamento(null);
  }, [identificadorIntervaloRolamento]);

  // Iniciar o scroll automático com base na velocidade atual
  const iniciarRolamentoAutomatico = useCallback(
    (velocidadeDesejada?: number) => {
      if (identificadorIntervaloRolamento) {
        clearInterval(identificadorIntervaloRolamento);
      }

      const velocidadeCalculada =
        velocidadeDesejada || referenciaVelocidadeRolamento.current || 1.0;
      const taxaPassoRolamento = 1;
      const intervaloBaseMilissegundos = 50;
      const velocidadeRolamentoFinal = taxaPassoRolamento * velocidadeCalculada;
      const tempoIntervaloCalculado = Math.max(
        10,
        intervaloBaseMilissegundos / velocidadeCalculada
      );

      const novoIdentificadorIntervalo = setInterval(() => {
        window.scrollBy({
          top: velocidadeRolamentoFinal,
          left: 0,
          behavior: "instant" as ScrollBehavior,
        });
      }, tempoIntervaloCalculado);

      setIdentificadorIntervaloRolamento(novoIdentificadorIntervalo);
    },
    [identificadorIntervaloRolamento]
  );

  // Alternar entre Reproduzir e Pausar o scroll automático
  const alternarEstadoRolamentoAutomatico = () => {
    if (estaExecutandoRolamentoAutomatico) {
      pararRolamentoAutomatico();
      setEstaExecutandoRolamentoAutomatico(false);
      return;
    }

    iniciarRolamentoAutomatico(velocidadeRolamentoAtual);
    setEstaExecutandoRolamentoAutomatico(true);
  };

  // Alterar velocidade manualmente via controle deslizante
  const alterarVelocidadeRolamentoManualmente = (
    novaVelocidadeEscolhida: number
  ) => {
    setVelocidadeRolamentoAtual(novaVelocidadeEscolhida);

    if (!estaExecutandoRolamentoAutomatico) {
      return;
    }

    pararRolamentoAutomatico();
    iniciarRolamentoAutomatico(novaVelocidadeEscolhida);
  };

  // Navegar suavemente até o card de uma música específica
  const navegarParaCardMusicaEspecifica = (indiceMusicaDestino: number) => {
    if (
      indiceMusicaDestino < 0 ||
      indiceMusicaDestino >= listaMusicasPotpourri.length
    ) {
      return;
    }

    const itemMusicaDestino = listaMusicasPotpourri[indiceMusicaDestino];
    if (!itemMusicaDestino) {
      return;
    }

    const elementoCardDestino = document.getElementById(
      `card-musica-potpourri-${itemMusicaDestino.id}`
    );

    if (!elementoCardDestino) {
      return;
    }

    const espacamentoSuperiorCompensacao = 80;
    const posicaoTopoElemento =
      elementoCardDestino.getBoundingClientRect().top +
      window.scrollY -
      espacamentoSuperiorCompensacao;

    window.scrollTo({
      top: Math.max(0, posicaoTopoElemento),
      behavior: "smooth",
    });

    setIndiceMusicaAtiva(indiceMusicaDestino);

    // Ajusta a velocidade de rolamento conforme configurado na música destino
    const velocidadeMusicaDestino =
      itemMusicaDestino.musica.velocidade_rolamento;
    if (
      velocidadeMusicaDestino &&
      velocidadeMusicaDestino !== velocidadeRolamentoAtual
    ) {
      setVelocidadeRolamentoAtual(velocidadeMusicaDestino);
      if (estaExecutandoRolamentoAutomatico) {
        pararRolamentoAutomatico();
        iniciarRolamentoAutomatico(velocidadeMusicaDestino);
      }
    }
  };

  // Voltar para a listagem de potpourris
  const voltarParaListagemPotpourris = () => {
    pararRolamentoAutomatico();
    navegarParaRota("/list-potpourris");
  };

  // Detectar qual música está visível na tela durante o scroll
  useEffect(() => {
    if (listaMusicasPotpourri.length === 0) {
      return;
    }

    const verificarMusicaMaisVisivelNaTela = () => {
      const linhaReferenciaVisao = window.innerHeight * 0.35;
      let indiceMaisApropriado = 0;
      let menorDistanciaLinhaVisao = Infinity;

      listaMusicasPotpourri.forEach(
        (itemMusicaPotpourri, indiceItemMusica) => {
          const elementoCardMusica = document.getElementById(
            `card-musica-potpourri-${itemMusicaPotpourri.id}`
          );

          if (!elementoCardMusica) {
            return;
          }

          const retanguloBounding = elementoCardMusica.getBoundingClientRect();
          // Se o card está próximo ou cruzando a linha de visão
          const distanciaAteLinhaVisao = Math.abs(
            retanguloBounding.top - linhaReferenciaVisao
          );

          if (
            retanguloBounding.top <= linhaReferenciaVisao &&
            retanguloBounding.bottom >= linhaReferenciaVisao
          ) {
            indiceMaisApropriado = indiceItemMusica;
            menorDistanciaLinhaVisao = -1; // Encontrou elemento que contém a linha de visão
            return;
          }

          if (
            menorDistanciaLinhaVisao !== -1 &&
            distanciaAteLinhaVisao < menorDistanciaLinhaVisao
          ) {
            menorDistanciaLinhaVisao = distanciaAteLinhaVisao;
            indiceMaisApropriado = indiceItemMusica;
          }
        }
      );

      if (indiceMaisApropriado !== indiceMusicaAtiva) {
        setIndiceMusicaAtiva(indiceMaisApropriado);

        // Atualiza a velocidade de rolamento conforme a velocidade configurada da música atual
        const musicaAtivaDetectada =
          listaMusicasPotpourri[indiceMaisApropriado];
        const velocidadeConfiguradaMusica =
          musicaAtivaDetectada?.musica.velocidade_rolamento;

        if (
          velocidadeConfiguradaMusica &&
          velocidadeConfiguradaMusica > 0 &&
          velocidadeConfiguradaMusica !== referenciaVelocidadeRolamento.current
        ) {
          setVelocidadeRolamentoAtual(velocidadeConfiguradaMusica);

          if (estaExecutandoRolamentoAutomatico) {
            if (identificadorIntervaloRolamento) {
              clearInterval(identificadorIntervaloRolamento);
            }

            const taxaPassoRolamento = 1;
            const intervaloBaseMilissegundos = 50;
            const velocidadeRolamentoFinal =
              taxaPassoRolamento * velocidadeConfiguradaMusica;
            const tempoIntervaloCalculado = Math.max(
              10,
              intervaloBaseMilissegundos / velocidadeConfiguradaMusica
            );

            const novoIdentificadorIntervalo = setInterval(() => {
              window.scrollBy({
                top: velocidadeRolamentoFinal,
                left: 0,
                behavior: "instant" as ScrollBehavior,
              });
            }, tempoIntervaloCalculado);

            setIdentificadorIntervaloRolamento(novoIdentificadorIntervalo);
          }
        }
      }
    };

    let identificadorAnimacaoScroll: number | null = null;
    const tratadorEventoScroll = () => {
      if (identificadorAnimacaoScroll !== null) {
        return;
      }
      identificadorAnimacaoScroll = window.requestAnimationFrame(() => {
        verificarMusicaMaisVisivelNaTela();
        identificadorAnimacaoScroll = null;
      });
    };

    window.addEventListener("scroll", tratadorEventoScroll, { passive: true });
    // Executa uma vez no início
    verificarMusicaMaisVisivelNaTela();

    return () => {
      window.removeEventListener("scroll", tratadorEventoScroll);
      if (identificadorAnimacaoScroll !== null) {
        window.cancelAnimationFrame(identificadorAnimacaoScroll);
      }
    };
  }, [
    listaMusicasPotpourri,
    indiceMusicaAtiva,
    estaExecutandoRolamentoAutomatico,
    identificadorIntervaloRolamento,
  ]);

  // Inicializa a velocidade da primeira música quando o potpourri carrega
  useEffect(() => {
    if (listaMusicasPotpourri.length === 0) {
      return;
    }

    const primeiraMusicaPotpourri = listaMusicasPotpourri[0];
    const velocidadePrimeiraMusica =
      primeiraMusicaPotpourri?.musica.velocidade_rolamento;

    if (velocidadePrimeiraMusica && velocidadePrimeiraMusica > 0) {
      setVelocidadeRolamentoAtual(velocidadePrimeiraMusica);
    }
  }, [listaMusicasPotpourri]);

  // Limpar intervalo quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (identificadorIntervaloRolamento) {
        clearInterval(identificadorIntervaloRolamento);
      }
    };
  }, [identificadorIntervaloRolamento]);

  return (
    <div className="container mx-auto py-6 px-3 sm:px-6 space-y-6 pb-28">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Music2 className="w-7 h-7 text-blue-600" />
            Visualizar Potpourri #{parametroIdentificadorPotpourri}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total de {listaMusicasPotpourri.length} músicas organizadas para
            tocagem contínua.
          </p>
        </div>
      </div>

      {estaCarregandoDadosPotpourri && (
        <div className="flex items-center justify-center p-12 text-gray-600 font-medium">
          Carregando músicas do potpourri...
        </div>
      )}

      {erroCarregamentoPotpourri && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl">
          Erro ao carregar potpourri: {erroCarregamentoPotpourri.message}
        </div>
      )}

      {/* Lista de Cards de Músicas do Potpourri */}
      {listaMusicasPotpourri.length > 0 &&
        listaMusicasPotpourri.map(
          (itemMusicaPotpourri, indiceItemMusica) => {
            const ehMusicaEmDestaque = indiceItemMusica === indiceMusicaAtiva;

            return (
              <Card
                key={itemMusicaPotpourri.id}
                id={`card-musica-potpourri-${itemMusicaPotpourri.id}`}
                className={`transition-all duration-300 rounded-2xl overflow-hidden border ${
                  ehMusicaEmDestaque
                    ? "border-blue-500 shadow-xl ring-2 ring-blue-400/30 dark:ring-blue-800/40"
                    : "border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md"
                }`}
              >
                <CardHeader className="px-4 py-3.5 bg-gray-50/70 dark:bg-zinc-900/70 border-b border-gray-100 dark:border-zinc-800 flex flex-row items-center justify-between space-y-0 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 shadow-sm">
                      {itemMusicaPotpourri.ordem_tocagem}
                    </span>
                    <CardTitle className="text-lg sm:text-xl font-bold truncate">
                      {itemMusicaPotpourri.musica.nome}
                    </CardTitle>
                  </div>

                  {itemMusicaPotpourri.musica.link_musica && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-[#fc8f36] hover:bg-[#e07b2b] text-white hover:text-white border-none flex items-center gap-1.5 rounded-full shrink-0 shadow-sm"
                    >
                      <a
                        href={itemMusicaPotpourri.musica.link_musica}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="hidden xs:inline">Cifra Club</span>
                      </a>
                    </Button>
                  )}
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm bg-gray-50/50 dark:bg-zinc-900/30 p-3 rounded-xl border border-gray-100 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Artista:</span>
                      <strong className="text-gray-900 dark:text-gray-100 truncate">
                        {itemMusicaPotpourri.musica.artista}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-600 dark:text-gray-400 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Ordem:</span>
                      <strong className="text-gray-900 dark:text-gray-100">
                        {itemMusicaPotpourri.ordem_tocagem}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">Velocidade:</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-mono">
                        {itemMusicaPotpourri.musica.velocidade_rolamento || 1}x
                      </strong>
                    </div>
                  </div>

                  {/* Exibição da Cifra com quebra de linha inteligente para largura da tela */}
                  <div className="w-full">
                    <pre
                      className="font-mono text-[14px] sm:text-[16px] bg-gray-50/80 dark:bg-zinc-950 p-4 rounded-xl whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full overflow-x-hidden border border-gray-200/80 dark:border-zinc-800/80 select-text leading-relaxed tracking-normal"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {formatarLinhaCifraComCores(
                        itemMusicaPotpourri.musica.cifra
                      )}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}

      {/* Rastreador Flutuante de Músicas do Potpourri */}
      {listaMusicasPotpourri.length > 0 && (
        <FloatingMusicTracker
          listaMusicasPotpourri={listaMusicasPotpourri}
          indiceMusicaAtual={indiceMusicaAtiva}
          velocidadeAtual={velocidadeRolamentoAtual}
          aoSelecionarMusica={navegarParaCardMusicaEspecifica}
        />
      )}

      {/* Controles Flutuantes de Reprodução e Velocidade */}
      <FloatingControls
        isPlaying={estaExecutandoRolamentoAutomatico}
        onPlayPause={alternarEstadoRolamentoAutomatico}
        speed={velocidadeRolamentoAtual}
        onSpeedChange={alterarVelocidadeRolamentoManualmente}
        onBack={voltarParaListagemPotpourris}
        showSaveButton={false}
        minSpeed={0.1}
        maxSpeed={3.0}
        speedStep={0.1}
      />
    </div>
  );
};
