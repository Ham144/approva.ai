/**
 * checkOperator
 * @param {Object} params
 * @param {string} params.operator - operator string from select
 * @param {*} params.actual - nilai yang diberikan user / requirementValue
 * @param {*} [params.expected] - nilai pembanding (logic.value). Tidak wajib untuk is true/is false.
 * @param {Object} [params.options]
 * @param {boolean} [params.options.caseSensitive=false] - apakah perbandingan string sensitif huruf
 * @returns {boolean}
 */
function checkOperator({ operator, actual, expected, options = {} }) {
  const { caseSensitive = false } = options;

  // Helpers
  const toStr = (v) => (v === null || v === undefined ? "" : String(v));
  const isEmpty = (v) =>
    v === null || v === undefined || (typeof v === "string" && v.trim() === "");

  const numericPattern = /^-?\d+(\.\d+)?$/;
  const booleanPattern = /^(true|false|yes|no)$/i;
  const maybeDatePattern = /\d{4}-\d{2}-\d{2}|T|:/; // quick hint for dates like "2025-08-21" or ISO

  const parseNumber = (v) => {
    if (typeof v === "number" && !isNaN(v)) return v;
    if (typeof v === "string") {
      const s = v.replace(/,/g, "").trim();
      if (numericPattern.test(s)) {
        const n = parseFloat(s);
        return isNaN(n) ? null : n;
      }
    }
    return null;
  };

  const parseBoolean = (v) => {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      if (s === "true" || s === "yes") return true;
      if (s === "false" || s === "no") return false;
    }
    return null;
  };

  const parseDate = (v) => {
    if (v instanceof Date && !isNaN(v.getTime())) return v;
    const s = toStr(v).trim();
    if (!s) return null;
    // try ISO / standard parse
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
    return null;
  };

  const equalString = (a, b) => {
    if (!caseSensitive)
      return toStr(a).trim().toLowerCase() === toStr(b).trim().toLowerCase();
    return toStr(a).trim() === toStr(b).trim();
  };

  // Determine handling based on operator text
  const op = (operator || "").trim().toLowerCase();

  // Some operators don't need expected (boolean checks)
  if (op === "is true (boolean)") {
    const bool = parseBoolean(actual);
    return bool === true;
  }
  if (op === "is false (boolean)") {
    const bool = parseBoolean(actual);
    return bool === false;
  }

  // For operators that explicitly reference Number/Date/String, use that hint
  const wantsNumber = op.includes("number");
  const wantsDate = op.includes("date");
  const wantsString = op.includes("string");
  const wantsBoolean = op.includes("boolean");

  // For generics like "is equal to (String/Number/Date/Boolean)"
  // we'll try to infer sensible type from inputs
  const inferType = (a, b) => {
    // prefer number if both look numeric
    if (a != null && b != null) {
      const aNum = parseNumber(a);
      const bNum = parseNumber(b);
      if (aNum !== null && bNum !== null) return "number";

      const aBool = parseBoolean(a);
      const bBool = parseBoolean(b);
      if (aBool !== null && bBool !== null) return "boolean";

      // detect date with simple pattern or valid parse
      if (
        maybeDatePattern.test(String(a)) ||
        maybeDatePattern.test(String(b))
      ) {
        const da = parseDate(a);
        const db = parseDate(b);
        if (da && db) return "date";
      }
    }

    // fallbacks: single value checks
    if (a != null) {
      if (parseNumber(a) !== null) return "number";
      if (parseBoolean(a) !== null) return "boolean";
      if (maybeDatePattern.test(String(a)) && parseDate(a)) return "date";
    }
    if (b != null) {
      if (parseNumber(b) !== null) return "number";
      if (parseBoolean(b) !== null) return "boolean";
      if (maybeDatePattern.test(String(b)) && parseDate(b)) return "date";
    }
    return "string";
  };

  // actual processing functions
  const act = actual;
  const exp = expected;

  // STRING operations
  if (
    op.includes("contains (string)") ||
    op.includes("does not contain (string)")
  ) {
    console.log("masuk logic contains");
    // if actual is array -> check includes; if string -> substring
    const needle = toStr(exp);
    if (Array.isArray(act)) {
      const found = act.some((item) =>
        caseSensitive
          ? String(item) === needle
          : String(item).toLowerCase() === needle.toLowerCase()
      );
      return op.includes("does not") ? !found : found;
    } else {
      const hay = toStr(act);
      const hay2 = caseSensitive ? hay : hay.toLowerCase();
      const needle2 = caseSensitive ? needle : needle.toLowerCase();
      const found = hay2.indexOf(needle2) !== -1;
      return op.includes("does not") ? !found : found;
    }
  }

  if (op.includes("starts with (string)")) {
    console.log("masuk logic starts with");

    const hay = toStr(act);
    const needle = toStr(exp);
    if (!caseSensitive) {
      return hay.toLowerCase().startsWith(needle.toLowerCase());
    }
    return hay.startsWith(needle);
  }

  if (op.includes("ends with (string)")) {
    console.log("masuk logic ends with");
    const hay = toStr(act);
    const needle = toStr(exp);
    if (!caseSensitive) {
      return hay.toLowerCase().endsWith(needle.toLowerCase());
    }
    return hay.endsWith(needle);
  }

  // NUMERIC comparisons
  if (
    (wantsNumber &&
      !(op.includes("is equal") || op.includes("is not equal"))) ||
    op.includes("is greater") ||
    op.includes("is less") ||
    op.includes("is greater than") ||
    op.includes("is less than")
  ) {
    console.log(
      "masuk logic number [is greater, is less, is greater than, is less than]"
    );
    const aNum = parseNumber(act);
    const bNum = parseNumber(exp);
    if (aNum === null || bNum === null) return false;
    if (op.includes("is greater than or equal")) return aNum >= bNum;
    if (op.includes("is less than or equal")) return aNum <= bNum;
    if (op.includes("is greater than")) return aNum > bNum;
    if (op.includes("is less than")) return aNum < bNum;
    // fallback equality if operator is generic equal
    if (op.includes("is equal")) return aNum === bNum;
    if (op.includes("is not equal")) return aNum !== bNum;
  }

  // DATE comparisons
  if (
    (wantsNumber &&
      !(op.includes("is equal") || op.includes("is not equal"))) ||
    op.includes("is before") ||
    op.includes("is after") ||
    op.includes("is on or before") ||
    op.includes("is on or after")
  ) {
    console.log(
      "masuk logic date [is before, is after, is on or before, is on or after]"
    );
    const aDate = parseDate(act);
    const bDate = parseDate(exp);
    if (!aDate || !bDate) return false;
    const at = aDate.getTime();
    const bt = bDate.getTime();
    if (op.includes("is before")) return at < bt;
    if (op.includes("is after")) return at > bt;
    if (op.includes("is on or before")) return at <= bt;
    if (op.includes("is on or after")) return at >= bt;
    if (op.includes("is equal")) return at === bt;
    if (op.includes("is not equal")) return at !== bt;
  }

  if (op.includes("is Exist") || op.includes("is Not Exist")) {
    console.log("masuk logic exist");
    if (op.includes("is Exist")) {
      return !isEmpty(actual);
    } else {
      return isEmpty(actual);
    }
  }

  // Generic equal / not equal (try to infer type)
  if (op.includes("is equal") || op.includes("is not equal")) {
    console.log("masuk logic generic [is equal, is not equal]");

    if (isEmpty(actual) || isEmpty(expected)) return false;

    const type = inferType(actual, expected);
    let comp = false;

    if (type === "number") {
      const aNum = parseNumber(actual);
      const bNum = parseNumber(expected);
      comp = aNum !== null && bNum !== null && aNum === bNum;
    } else if (type === "boolean") {
      const aBool = parseBoolean(actual);
      const bBool = parseBoolean(expected);
      comp = aBool !== null && bBool !== null && aBool === bBool;
    } else if (type === "date") {
      const aDate = parseDate(actual);
      const bDate = parseDate(expected);
      comp = aDate && bDate && aDate.getTime() === bDate.getTime();
    } else {
      // fallback ke string comparison (dengan case sensitivity option)

      comp = equalString(actual, expected);
    }

    return op.includes("is not") ? !comp : comp;
  }

  // If nothing matched, be conservative -> false
  return false;
}

export default checkOperator;
