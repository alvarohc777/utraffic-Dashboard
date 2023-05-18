const progressCalculator = (planPago) => {
  let pagos = 0;
  let numeroCuotas = planPago.length;
  planPago.forEach((cuota) => {
    pagos += cuota.estado === "pagado" ? 1 : 0;
    pagos += cuota.estado === "pagadoMora" ? 1 : 0;
  });
  let progress = pagos / numeroCuotas;
  return (progress * 100).toFixed(0);
};
const scoreCalculator = (planPago) => {
  let cuotasEnMora = 0;
  let numeroCuotasGeneradas = 0;
  planPago.forEach((cuota) => {
    // Total cuotas en mora / pagadas en mora
    cuotasEnMora += cuota.estado === "mora" ? 1 : 0;
    cuotasEnMora += cuota.estado === "pagadoMora" ? 1 : 0;
    // Total cuotas generadas
    numeroCuotasGeneradas += cuota.estado === "pagadoMora" ? 1 : 0;
    numeroCuotasGeneradas += cuota.estado === "pagado" ? 1 : 0;
    numeroCuotasGeneradas += cuota.estado === "mora" ? 1 : 0;
  });
  return Math.floor(
    ((numeroCuotasGeneradas - cuotasEnMora) / numeroCuotasGeneradas) * 5
  );
};

export { progressCalculator, scoreCalculator };
