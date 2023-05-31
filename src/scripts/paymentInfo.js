// Calcula el porcentaje de meses pagos
// planPago: Array o string ("null" si Array no existe en DB)
// output -> progress: float
const progressCalculator = (planPago) => {
  let progress = 0;
  if (planPago === "null") return 0;
  let pagos = 0;
  let numeroCuotas = planPago.length;
  planPago.forEach((cuota) => {
    pagos += cuota.status === "pagado" ? 1 : 0;
    pagos += cuota.status === "pagadoMora" ? 1 : 0;
  });
  progress = pagos / numeroCuotas;
  return progress;
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
    if (
      paymentFee[i].status == null ||
      paymentFee[i].status == "mora" ||
      paymentFee[i].status == "pagoParcial"
    )
      return [paymentFee[i].date, paymentFee[i].amount];
  }
  return ["Finalizada", 0];
};

const creditStatus = (paymentFee) => {
  for (let i = 0; i < paymentFee.length; i++) {
    if (paymentFee[i].status == "mora") return "Mora";
  }
  return "On Time";
};

// Cretes Date-Pay array and duplicates last entry
// so the whole month is plotted
const datePaySeriesCreate = (datePayDict) => {
  let datePayArray = [];
  for (var date in datePayDict) {
    let payment = datePayDict[date];
    date = date.split("-");
    date = new Date(date[0], date[1] - 1, date[2]);
    date = Date.parse(date);
    datePayArray.push([date, payment]);
  }
  datePayArray = datePayArray.sort(function (a, b) {
    return a[0] - b[0];
  });

  return datePayArray;
};

// Creates projection of customer
// returns dictionary of {date: amount}
const projection = (customers) => {
  let projection = {};
  customers.forEach((customer) => {
    if (customer.paymentPlan.length === 0) return;
    customer.paymentPlan.forEach((payment) => {
      if (payment.date in projection) {
        projection[payment.date] += parseFloat(payment.amount);
      } else {
        projection[payment.date] = parseFloat(payment.amount);
      }
    });
  });
  return projection;
};

const pagos = (customers) => {
  let pagos = {};
  customers.forEach((customer) => {
    if (customer.paymentHistorical.length === 0) return;

    customer.paymentHistorical.forEach((payment) => {
      if (payment.date in pagos) {
        pagos[payment.date] += parseFloat(payment.amount);
      } else {
        pagos[payment.date] = parseFloat(payment.amount);
      }
    });
  });
  return pagos;
};

const pagosMora = (customers) => {
  let pagosMora = {};

  customers.forEach((customer) => {
    if (customer.paymentFee.length === 0) {
      console.log("se salio");
      return;
    }

    customer.paymentFee.forEach((payment) => {
      if (payment.status === "mora" || payment.status === "pagadoMoraParcial") {
        if (payment.date in pagosMora) {
          pagosMora[payment.date] -= parseInt(payment.amount);
        } else {
          pagosMora[payment.date] = -parseInt(payment.amount);
        }
      }
    });
  });
  return pagosMora;
};

// Creates planPago, Pagos and mora arrays
const datePayDictCreate = (customers) => {
  let planPago = {};
  customers.forEach((cliente) => {
    if (cliente.paymentFee.length === 0) {
      return;
    }
    cliente.paymentFee.forEach((pago) => {
      if (pago.date in planPago) {
        planPago[pago.date] += parseFloat(pago.amount);
      } else {
        planPago[pago.date] = parseFloat(pago.amount);
      }
      // console.log(pago.date);

      if (pago.status === "pagado" || pago.status === "pagadoMora") {
        if (pago.date in pagos) {
          pagos[pago.date] += parseFloat(pago.amount);
        } else {
          pagos[pago.date] = parseFloat(pago.amount);
        }
      }

      if (pago.status === "mora") {
        if (pago.date in mora) {
          mora[pago.date] -= parseFloat(pago.amount);
        } else {
          mora[pago.date] = -parseFloat(pago.amount);
        }
      }
    });
  });

  return [planPago, pagos, mora];
};

export {
  scoreCalculator,
  mesesPagos,
  progressCalculator,
  currentFee,
  creditStatus,
  datePayDictCreate,
  datePaySeriesCreate,
  projection,
  pagosMora,
  pagos,
};
