import { Card, CardContent } from "@/components/ui/card";
import React from "react";

type ErrorProps = {
  message: string;
};
export const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            <p className="text-lg font-medium">Erro ao carregar músicas</p>
            <p className="text-sm">{message || ""}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

