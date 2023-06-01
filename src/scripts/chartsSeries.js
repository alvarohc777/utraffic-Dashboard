const totalByCategory = (data, categoryField, seriesField) => {
  let categories = [];
  let series = [];
  data.forEach((entry) => {
    if (!categories.includes(entry[categoryField])) {
      categories.push(entry[categoryField]);
      series.push(parseFloat(entry[seriesField]));
    } else {
      series[categories.indexOf(entry[categoryField])] += parseFloat(
        entry[seriesField]
      );
    }
  });
  return [categories, series];
};

const datesCreator = (data, field) => {
  let dates = [];
  data.forEach((entry) => {
    entry[field].forEach((payment) => {
      if (!dates.includes(payment.date)) {
        dates.push(payment.date);
      }
    });
  });

  return dates;
};

const sortArray = (unsortedArray) => {
  let sortedArray = unsortedArray.sort((a, b) => {
    return a[0] - b[0];
  });
  return sortedArray;
};
const datesByMonth = (dates) => {
  let datesByMonth = [];
  dates.forEach((date) => {
    if (!datesByMonth.includes(date.slice(0, 7))) {
      datesByMonth.push(date.slice(0, 7));
    }
  });
  datesByMonth = sortArray(datesByMonth);

  return datesByMonth;
};

const goalsAdd = (pagos, projection) => {
  let series = [];
  Object.entries(pagos).forEach((entry) => {
    let date = entry[0];
    let pago = entry[1];
    let _ = {
      x: date,
      y: pago,
      goals: [
        {
          name: "Proyectado",
          value: 0,
          strokeHeight: 5,
          strokeColor: "#775DD0",
        },
      ],
    };
    if (entry[0] in projection) {
      let goal = projection[entry[0]];
      _.goals[0].value = goal;
      series.push(_);
    } else {
      series.push(_);
    }
  });
  return series;
};
const seriesCreator = (data, field, datesByMonth) => {
  let series = new Array(datesByMonth.length).fill(0);
  data[field].forEach((entry) => {
    let idx = datesByMonth.indexOf(entry.date.slice(0, 7));
    if (series[idx] === 0) {
      series[idx] = entry.amount;
    } else {
      series[idx] += entry.amount;
    }
  });
  return series;
};

export { totalByCategory, datesCreator, datesByMonth, goalsAdd, seriesCreator };
