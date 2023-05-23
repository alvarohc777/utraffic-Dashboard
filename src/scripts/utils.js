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

// Formatting functions
const compactNumbers = new Intl.NumberFormat("es-US", {
  notation: "compact",
});

const formattedTotal = new Intl.NumberFormat("es-US", {
  style: "currency",
  currency: "USD",
});

// Cretes Date-Pay array and duplicates las entry
// so the whole month is plotted
const datePaySeriesCreate = (datePayDict) => {
  let datePayArray = [];
  for (var date in datePayDict) {
    let payment = datePayDict[date];
    date = date.split("/");
    date = new Date(date[2], date[1] - 1, date[0]);
    date = Date.parse(date);
    datePayArray.push([date, payment]);
  }
  datePayArray = datePayArray.sort(function (a, b) {
    return a[0] - b[0];
  });

  let lastDate =
    datePayArray[datePayArray.length - 1] &&
    datePayArray[datePayArray.length - 1][0];
  let lastPay =
    datePayArray[datePayArray.length - 1] &&
    datePayArray[datePayArray.length - 1][1];
  lastDate = new Date(lastDate).setMonth(new Date(lastDate).getMonth() + 1);

  datePayArray.push([lastDate, lastPay]);
  return datePayArray;
};

// Creates planPago, Pagos and mora arrays
const datePayDictCreate = (customers) => {
  let planPago = {};
  let pagos = {};
  let mora = {};
  customers.forEach((cliente) => {
    cliente.planPago.forEach((pago) => {
      if (pago.fecha in planPago) {
        planPago[pago.fecha] += parseInt(pago.pago);
      } else {
        planPago[pago.fecha] = parseInt(pago.pago);
      }

      if (pago.estado === "pagado" || pago.estado === "pagadoMora") {
        if (pago.fecha in pagos) {
          pagos[pago.fecha] += parseInt(pago.pago);
        } else {
          pagos[pago.fecha] = parseInt(pago.pago);
        }
      }

      if (pago.estado === "mora") {
        if (pago.fecha in mora) {
          mora[pago.fecha] += parseInt(pago.pago);
        } else {
          mora[pago.fecha] = parseInt(pago.pago);
        }
      }
    });
  });
  return [planPago, pagos, mora];
};

export {
  progressCalculator,
  scoreCalculator,
  compactNumbers,
  formattedTotal,
  datePayDictCreate,
  datePaySeriesCreate,
};
