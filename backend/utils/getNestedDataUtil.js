function getNestedValue({ obj, pointer }) {
  if (!pointer) return obj;
  return pointer.split(".").reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : null;
  }, obj);
}
export default getNestedValue;
