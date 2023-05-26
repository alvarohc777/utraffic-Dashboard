// Calcula el porcentaje de meses pagos
// planPago: Array o string ("null" si Array no existe en DB)
// output -> progress: float
const progressCalculator = (planPago) => {
  let progress = 0;
  if (planPago === "null") return (progress * 100).toFixed(0);
  let pagos = 0;
  let numeroCuotas = planPago.length;
  planPago.forEach((cuota) => {
    pagos += cuota.status === "pagado" ? 1 : 0;
    pagos += cuota.status === "pagadoMora" ? 1 : 0;
  });
  progress = pagos / numeroCuotas;
  return (progress * 100).toFixed(0);
};

// Calcula los meses pagos
// planPago: Array o string ("null" si Array no existe en json)
// output -> mesesPagos: int
const mesesPagos = (planPago) => {
  let mesesPagos = 0;
  if (planPago === "null") return 0;
  planPago.forEach((cuota) => {
    mesesPagos += cuota.status === "pagado" ? 1 : 0;
    mesesPagos += cuota.status === "pagadoMora" ? 1 : 0;
  });
  return mesesPagos;
};

const scoreCalculator = (planPago) => {
  let cuotasEnMora = 0;
  let numeroCuotasGeneradas = 0;
  planPago.forEach((cuota) => {
    // Total cuotas en mora / pagadas en mora
    cuotasEnMora += cuota.status === "mora" ? 1 : 0;
    cuotasEnMora += cuota.status === "pagadoMora" ? 1 : 0;
    // Total cuotas generadas
    numeroCuotasGeneradas += cuota.status === "pagadoMora" ? 1 : 0;
    numeroCuotasGeneradas += cuota.status === "pagado" ? 1 : 0;
    numeroCuotasGeneradas += cuota.status === "mora" ? 1 : 0;
  });
  return Math.floor(
    ((numeroCuotasGeneradas - cuotasEnMora) / numeroCuotasGeneradas) * 5
  );
};

const currentFee = (paymentFee) => {
  // let fee = null
  for (let i = 0; i < paymentFee.length; i++) {
    if (paymentFee[i].status == null || paymentFee[i].status == "mora")
      return paymentFee[i].date;
  }
};

export { scoreCalculator, mesesPagos, progressCalculator, currentFee };
