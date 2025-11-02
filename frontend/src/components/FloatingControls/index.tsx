import React from "react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { Play, Pause, Save, ArrowLeft, Loader2 } from "lucide-react";

export interface FloatingControlsProps {
  // Controles de reprodução
  isPlaying: boolean;
  onPlayPause: () => void;

  // Controles de velocidade
  speed: number;
  onSpeedChange: (speed: number) => void;
  minSpeed?: number;
  maxSpeed?: number;
  speedStep?: number;

  // Controles de ação
  onSave?: () => void;
  onBack?: () => void;
  isSaving?: boolean;

  // Configurações visuais
  showSaveButton?: boolean;
  showBackButton?: boolean;
  showSpeedControl?: boolean;
  showPlayButton?: boolean;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
  minSpeed = 0.1,
  maxSpeed = 3.0,
  speedStep = 0.1,
  onSave,
  onBack,
  isSaving = false,
  showSaveButton = true,
  showBackButton = true,
  showSpeedControl = true,
  showPlayButton = true,
}) => {
  const handleSpeedChange = (value: number[]) => {
    onSpeedChange(value[0]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 opacity-65">
      <div className="flex flex-col items-end gap-3">
        {/* Botão de Play/Pause */}
        {showPlayButton && (
          <Button
            onClick={onPlayPause}
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        )}

        {/* Botão de Salvar */}
        {showSaveButton && onSave && (
          <Button
            onClick={onSave}
            disabled={isSaving}
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Save className="h-6 w-6" />
            )}
          </Button>
        )}

        {/* Botão de Voltar */}
        {showBackButton && onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-white hover:bg-gray-50 border-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Controle de Velocidade */}
        {showSpeedControl && (
          <div className="bg-white rounded-lg shadow-lg p-4 border">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Velocidade
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[speed]}
                  onValueChange={handleSpeedChange}
                  min={minSpeed}
                  max={maxSpeed}
                  step={speedStep}
                  className="w-32"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{minSpeed}x</span>
                  <span className="font-medium">{speed}x</span>
                  <span>{maxSpeed}x</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
