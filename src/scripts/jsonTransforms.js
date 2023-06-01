// Verifica que dataArray sea un array, sino convierte la respuesta en un array
// Por cada entrada del array ejecuta ObjectTransform
const jsonTransform = (dataArray, keysToFind) => {
  if (!Array.isArray(dataArray)) {
    dataArray = [dataArray];
  }
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
    if (keyToFind.length === 2) {
      newObject[keyToFind[0]] = findVal(dataObj, keyToFind[1]);
    } else if (keyToFind.length === 3) {
      if (!(keyToFind[0] in newObject)) {
        newObject[keyToFind[0]] = {};
      }
      newObject[keyToFind[0]] = findVal(
        findVal(dataObj, keyToFind[1]),
        keyToFind[2]
      );
    }
  });
  return newObject;
};

const findVal = (obj, keyToFind) => {
  // if object is null, returns null
  if (obj === null) return null;
  if (Array.isArray(obj)) return "This is an Array";

  // Verify whether key exists in object
  if (obj[keyToFind]) return obj[keyToFind];
  if (Array.isArray(obj[keyToFind])) return obj[keyToFind];
  if (obj[keyToFind] == "") return obj[keyToFind];
  if (obj[keyToFind] === null) return "null";

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

export { jsonTransform };
