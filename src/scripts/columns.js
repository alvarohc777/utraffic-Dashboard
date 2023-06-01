import { formattedTotal } from "./utils";
import {
  currentFee,
  mesesPagos,
  progressCalculator,
  creditStatus,
} from "./paymentInfo";

const nSolicitudColumn = {
  name: "nSolicitud",
  required: true,
  label: "N° Solicitud",
  align: "right",
  field: (row) => row.creditId,
  sortable: true,
};

const clienteColumn = {
  name: "cliente",
  required: true,
  label: "Cliente",
  align: "left",
  field: (row) => row.cliente,
  format: (val, row) => row.cliente,
  sortable: true,
};

const montoColumn = {
  name: "monto",
  label: "Monto",
  field: (row) => row.monto,
  sortable: true,
  format: (val, row) => `${formattedTotal.format(row.monto)}`,
};

const fechaSolicitudColumn = {
  name: "fechaSolicitud",
  label: "Fecha solicitud",
  align: "right",
  field: (row) => row.fechaSolicitud,
  sortable: true,
};

const calificacionColumn = {
  name: "calificacion",
  required: true,
  label: "Calificacion",
  align: "left",
  field: (row) => row.calificacion,
  sortable: true,
  format: (val, row) => `${"\u2B50".repeat(row.calificacion)}`,
};
const asesorColumn = {
  name: "asesor",
  required: true,
  label: "Asesor",
  align: "left",
  field: (row) => row.asesor,
  sortable: true,
};
const plazoColumn = {
  name: "plazo",
  label: "Plazo (m)",
  align: "right",
  field: (row) => row.plazo,
  sortable: true,
};
const mesesPagosColumns = {
  name: "mesesPagos",
  label: "Meses Pagos (m)",
  align: "right",
  field: (row) => mesesPagos(row.paymentFee),
  sortable: true,
};
const progresoColumn = {
  name: "progreso",
  label: "Progreso",
  align: "right",
  sortable: true,
  field: (row) => progressCalculator(row.paymentFee),
  format: (val, row) => {
    return `${(val * 100).toFixed(0)}%`;
  },
};
const currentFeeColumn = {
  name: "currentFee",
  label: "Próximo Pago",
  align: "right",
  sortable: true,
  field: (row) => row.paymentFee,
  format: (val, row) => {
    let [date, _] = currentFee(val);
    return date;
  },
};
const pagoColumn = {
  name: "currentPayment",
  label: "Pago",
  align: "right",
  sortable: true,
  field: (row) => row.paymentFee,
  format: (val, row) => {
    let [_, pago] = currentFee(val);
    return formattedTotal.format(pago);
  },
};
const creditStatusColumn = {
  name: "creditStatus",
  label: "Estado",
  align: "right",
  sortable: true,
  field: (row) => creditStatus(row.paymentFee),
};
export {
  nSolicitudColumn,
  clienteColumn,
  montoColumn,
  fechaSolicitudColumn,
  calificacionColumn,
  asesorColumn,
  plazoColumn,
  mesesPagosColumns,
  progresoColumn,
  currentFeeColumn,
  pagoColumn,
  creditStatusColumn,
};

// ]);
