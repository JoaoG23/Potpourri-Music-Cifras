import React, { useState } from "react";
import {
  Music,
  ChevronUp,
  ChevronDown,
  ListMusic,
  Gauge,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import type { MusicaPotpourriWithDetails } from "../../../../../types/potpourri";

export interface FloatingMusicTrackerProps {
  listaMusicasPotpourri: MusicaPotpourriWithDetails[];
  indiceMusicaAtual: number;
  velocidadeAtual: number;
  aoSelecionarMusica: (indiceMusicaDestino: number) => void;
}

export const FloatingMusicTracker: React.FC<FloatingMusicTrackerProps> = ({
  listaMusicasPotpourri,
  indiceMusicaAtual,
  velocidadeAtual,
  aoSelecionarMusica,
}) => {
  const [estaPainelListaAberto, setEstaPainelListaAberto] =
    useState<boolean>(false);

  // Early return se a lista de músicas estiver vazia
  if (!listaMusicasPotpourri || listaMusicasPotpourri.length === 0) {
    return null;
  }

  const totalMusicasPotpourri = listaMusicasPotpourri.length;
  const musicaAtualInformacoes =
    listaMusicasPotpourri[indiceMusicaAtual] || listaMusicasPotpourri[0];

  const numeroMusicaAtual = indiceMusicaAtual + 1;
  const percentualProgressoPotpourri = Math.round(
    (numeroMusicaAtual / totalMusicasPotpourri) * 100
  );

  const executarNavegacaoMusicaAnterior = () => {
    if (indiceMusicaAtual <= 0) {
      return;
    }
    const novoIndiceMusicaAnterior = indiceMusicaAtual - 1;
    aoSelecionarMusica(novoIndiceMusicaAnterior);
  };

  const executarNavegacaoProximaMusica = () => {
    if (indiceMusicaAtual >= totalMusicasPotpourri - 1) {
      return;
    }
    const novoIndiceProximaMusica = indiceMusicaAtual + 1;
    aoSelecionarMusica(novoIndiceProximaMusica);
  };

  const alternarVisibilidadePainelLista = () => {
    setEstaPainelListaAberto(
      (estadoAnteriorVisibilidade) => !estadoAnteriorVisibilidade
    );
  };

  const selecionarItemListaMusica = (indiceEscolhido: number) => {
    aoSelecionarMusica(indiceEscolhido);
    setEstaPainelListaAberto(false);
  };

  return (
    <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40 flex flex-col items-start gap-2 max-w-[calc(100vw-2rem)] sm:max-w-md">
      {/* Card Flutuante Principal */}
      <div className="flex items-center gap-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-gray-200/90 dark:border-zinc-800 shadow-xl rounded-2xl p-2.5 sm:p-3 transition-all duration-300 hover:shadow-2xl hover:border-blue-400/50">
        {/* Ícone com Indicador Circular de Progresso */}
        <button
          type="button"
          onClick={alternarVisibilidadePainelLista}
          title="Ver lista de músicas do potpourri"
          className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Music className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow border-2 border-white dark:border-zinc-900">
            {numeroMusicaAtual}
          </span>
        </button>

        {/* Informações da Música Atual */}
        <div
          className="flex flex-col cursor-pointer min-w-0 pr-1 max-w-[150px] xs:max-w-[200px] sm:max-w-[220px]"
          onClick={alternarVisibilidadePainelLista}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Música {numeroMusicaAtual} de {totalMusicasPotpourri}
            </span>
            <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
              <Gauge className="w-3 h-3 text-indigo-500" />
              {velocidadeAtual}x
            </span>
          </div>

          <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 truncate leading-tight mt-0.5">
            {musicaAtualInformacoes.musica.nome}
          </span>

          <span className="text-xs text-gray-600 dark:text-gray-400 truncate leading-tight">
            {musicaAtualInformacoes.musica.artista}
          </span>
        </div>

        {/* Botões de Navegação Entre Músicas */}
        <div className="flex items-center gap-1 border-l border-gray-200 dark:border-zinc-800 pl-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={executarNavegacaoMusicaAnterior}
            disabled={indiceMusicaAtual <= 0}
            title="Música anterior"
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={executarNavegacaoProximaMusica}
            disabled={indiceMusicaAtual >= totalMusicasPotpourri - 1}
            title="Próxima música"
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={alternarVisibilidadePainelLista}
            title="Abrir playlist"
            className="w-8 h-8 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <ListMusic className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Barra de Progresso do Potpourri */}
      <div className="w-full bg-gray-200/80 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentualProgressoPotpourri}%` }}
        />
      </div>

      {/* Painel Expansível de Músicas do Potpourri */}
      {estaPainelListaAberto && (
        <div className="w-full max-h-[60vh] overflow-y-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border border-gray-200/90 dark:border-zinc-800 shadow-2xl rounded-2xl p-3 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <ListMusic className="w-4 h-4 text-blue-600" />
              Músicas do Potpourri ({totalMusicasPotpourri})
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-6 h-6 rounded-full"
              onClick={() => setEstaPainelListaAberto(false)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            {listaMusicasPotpourri.map(
              (itemMusicaPotpourri, indiceItemMusica) => {
                const ehMusicaAtiva = indiceItemMusica === indiceMusicaAtual;
                const velocidadeMusicaConfigurada =
                  itemMusicaPotpourri.musica.velocidade_rolamento || 1;

                return (
                  <button
                    key={itemMusicaPotpourri.id}
                    type="button"
                    onClick={() => selecionarItemListaMusica(indiceItemMusica)}
                    className={`flex items-center justify-between p-2 rounded-xl text-left transition-colors duration-150 ${
                      ehMusicaAtiva
                        ? "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100"
                        : "hover:bg-gray-100 dark:hover:bg-zinc-800/60 text-gray-800 dark:text-gray-200 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span
                        className={`text-xs font-bold w-5 text-center ${
                          ehMusicaAtiva
                            ? "text-blue-600 dark:text-blue-400 font-extrabold"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {indiceItemMusica + 1}.
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-semibold truncate leading-tight">
                          {itemMusicaPotpourri.musica.nome}
                        </span>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400 truncate leading-tight">
                          {itemMusicaPotpourri.musica.artista}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded font-mono">
                        {velocidadeMusicaConfigurada}x
                      </span>
                      {ehMusicaAtiva && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};
