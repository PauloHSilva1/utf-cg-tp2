export const parametrosOndas = Object.freeze({
  amplitude: .12,
  numeroOnda: 1.1,
  frequencia: 1.8,
});

export function alturaOnda(x, tempo) {
  const { amplitude, numeroOnda, frequencia } = parametrosOndas;
  return amplitude * Math.sin(numeroOnda * x + frequencia * tempo);
}

export function inclinacaoOnda(x, tempo) {
  const { amplitude, numeroOnda, frequencia } = parametrosOndas;
  return amplitude * numeroOnda * Math.cos(numeroOnda * x + frequencia * tempo);
}
