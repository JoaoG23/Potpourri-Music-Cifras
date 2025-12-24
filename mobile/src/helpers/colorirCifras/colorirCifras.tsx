import React from "react";
import { Text } from "react-native";

export const colorirCifras = (texto: string) => {
  if (!texto) return null;

  const regexCifra =
    /\b([A-G][#b]?(?:m|maj|dim|aug|sus|7M|°)?[0-9]*(?:\/[A-G][#b]?)?)\b/g;

  const linhas = texto.split("\n");

  return linhas.map((linha, lineIdx) => {
    const partes = [];
    let ultimoIndex = 0;
    let match;

    // Reset regex index for each line
    regexCifra.lastIndex = 0;

    while ((match = regexCifra.exec(linha)) !== null) {
      if (match.index > ultimoIndex) {
        partes.push(linha.substring(ultimoIndex, match.index));
      }

      partes.push(
        <Text
          key={`cifra-${lineIdx}-${match.index}`}
          style={{ color: "#2563eb", fontWeight: "bold", fontSize: 16 }}
        >
          {match[0]}
        </Text>
      );

      ultimoIndex = match.index + match[0].length;
    }

    if (ultimoIndex < linha.length) {
      partes.push(linha.substring(ultimoIndex));
    }

    return (
      <Text key={`line-${lineIdx}`} style={{ fontSize: 15, fontFamily: "monospace", marginBottom: 3 }}>
        {partes}
        {/* {"\n"} */}
      </Text>
    );
  });
};
