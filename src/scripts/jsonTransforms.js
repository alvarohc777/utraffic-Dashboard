// const jsonClientes = (data) => {
//   let newJson = [];
//   data.forEach((item) => {
//     let customerData = item.attributes.customer.data;
//     let nombre = customerData ? customerData.attributes.full_name : null;
//     let planPago = item.attributes.payment_fee
//       ? item.attributes.payment_fee
//       : [];

//     if (nombre) {
//       let info = {
//         nombre: nombre,
//         nSolicitud: item.id,
//         monto: item.attributes.amount,
//         fechaSolicitud: item.attributes.applicationdate,
//         plazo: item.attributes.term,
//         planPago: planPago,
//         // planPago: [],
//         documento: null,
//         calificacion: null,
//       };
//       newJson.push(info);
//     }
//   });
//   // console.log("new Json", newJson[0]);
//   return newJson;
// };

const jsonTransform = (dataArray, keysToFind) => {
  let newJson = [];
  dataArray.forEach((data) => {
    newJson.push(objectTransform(data, keysToFind));
  });
  return newJson;
};

const objectTransform = (dataObj, keysToFind) => {
  let newObject = {};
  // Crear exception aquí*
  if (Array.isArray(dataObj)) return "Error This is an Array";
  keysToFind.forEach((keyToFind) => {
    if (typeof keyToFind === "string") {
      newObject[keyToFind] = findVal(dataObj, keyToFind);
    } else {
      // newObject[`${keyToFind[0]}_${keyToFind[1]}`] = findVal(
      //   findVal(dataObj, keyToFind[0]),
      //   keyToFind[1]
      // );
      if (!(keyToFind[0] in newObject)) {
        newObject[keyToFind[0]] = {};
      }
      newObject[keyToFind[0]][keyToFind[1]] = findVal(
        findVal(dataObj, keyToFind[0]),
        keyToFind[1]
      );
    }
  });
  return newObject;
};
// const objectTransform = (dataObj, keysToFind) => {
//   let newObject = {};
//   // Crear exception aquí*
//   if (Array.isArray(dataObj)) return "Error This is an Array";
//   keysToFind.forEach((keyToFind) => {
//     newObject[keyToFind] = findVal(dataObj, keyToFind);
//   });
//   return newObject;
// };

const findVal = (obj, keyToFind) => {
  // if object is null, returns null
  if (obj === null) return null;
  if (Array.isArray(obj)) return "This is an Array";

  // Verify whether key exists in object
  if (obj[keyToFind]) return obj[keyToFind];
  if (Array.isArray(obj[keyToFind])) return obj[keyToFind];
  if (obj[keyToFind] == "") return obj[keyToFind];
  if (obj[keyToFind] === null) return "Valor es null";

  // If not, iterates through every key in the object
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      // console.log("key: ", key);
      if (key === null || Array.isArray(obj[key])) {
        continue;
      }

      const value = findVal(obj[key], keyToFind);

      if (value || value == "") return value;
    }
  }
  return "not Found";
};

// const findValArray3 = (obj) => {
//   // if object is null, returns null
//   if (obj === null) return null;
//   for (let i = 0; i < keysToFind.length; i++) {
//     let keyToFind = keysToFind[i];
//     if (obj[keyToFind]) {
//       results[keysToFind.splice(i, 1)] = obj[keyToFind];
//       return true;
//     }
//     if (Array.isArray(obj[keyToFind])) {
//       results[keysToFind.splice(i, 1)] = obj[keyToFind];
//       return true;
//     }
//     if (obj[keyToFind] == "") {
//       results[keysToFind.splice(i, 1)] = obj[keyToFind];
//       return true;
//     }
//     if (obj[keyToFind] === null) {
//       results[keysToFind.splice(i, 1)] = "Valor es null";
//       return true;
//     }
//   }
//   // Verify whether key exists in object

//   // If not, iterates through every key in the object
//   for (let key in obj) {
//     if (typeof obj[key] === "object") {
//       console.log("key: ", key);
//       if (key === null) {
//         console.log("found null Key");
//         continue;
//       }
//       if (Array.isArray(obj[key])) {
//         console.log("Found Array Key");
//         continue;
//       }
//       const value = findVal(obj[key]);

//       // if (value || value == "") return value;
//     }
//   }

//   // return "not Found";
// };

export { jsonTransform };
