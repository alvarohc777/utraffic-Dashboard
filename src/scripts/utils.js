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

// Formatting functions
const compactNumbers = new Intl.NumberFormat("es-US", {
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
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
    date = date.split("-");
    date = new Date(date[0], date[1] - 1, date[2]);
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
      if (pago.date in planPago) {
        planPago[pago.date] += parseInt(pago.amount);
      } else {
        planPago[pago.date] = parseInt(pago.amount);
      }

      if (pago.status === "pagado" || pago.status === "pagadoMora") {
        if (pago.date in pagos) {
          pagos[pago.date] += parseInt(pago.amount);
        } else {
          pagos[pago.date] = parseInt(pago.amount);
        }
      }

      if (pago.status === "mora") {
        if (pago.date in mora) {
          mora[pago.date] -= parseInt(pago.amount);
        } else {
          mora[pago.date] = -parseInt(pago.amount);
        }
      }
    });
  });

  return [planPago, pagos, mora];
};

const jsonTransform = (data) => {
  let newJson = [];
  data.forEach((item) => {
    let customerData = item.attributes.customer.data;
    let nombre = customerData ? customerData.attributes.full_name : null;
    let planPago = item.attributes.payment_fee
      ? item.attributes.payment_fee
      : [];

    if (nombre) {
      let info = {
        nombre: nombre,
        nSolicitud: item.id,
        monto: item.attributes.amount,
        fechaSolicitud: item.attributes.applicationdate,
        plazo: item.attributes.term,
        planPago: planPago,
        // planPago: [],
        documento: null,
        calificacion: null,
      };
      newJson.push(info);
    }
  });
  // console.log("new Json", newJson[0]);
  return newJson;
};

const createFilterData = (data, target, attr) => {
  data.value.forEach((row) => {
    if (target.value.indexOf(row[`${attr}`]) == -1) {
      target.value.push(row[`${attr}`]);
    }
  });
};

// Creates select Element filtered Data
const selectFilter = (data, dataFiltered, field, fields, attr) => {
  if (field.value && field.value !== "-") {
    dataFiltered.value = data.value.filter((row) => row[attr] === field.value);
    if (fields.value.indexOf("-") == -1) {
      fields.value.unshift("-");
    }
    return;
  }
  if (field.value == "-") {
    fields.value.shift();
    field.value = null;
  }
  dataFiltered.value = data.value;
};

export {
  progressCalculator,
  scoreCalculator,
  compactNumbers,
  formattedTotal,
  datePayDictCreate,
  datePaySeriesCreate,
  jsonTransform,
  createFilterData,
  mesesPagos,
  selectFilter,
};
