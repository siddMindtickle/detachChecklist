import XLSX from "xlsx";
import camelcase from "camelcase";
import { isObject } from "@utils";

export const exportFile = (filename, data) => {
  if (!(filename && (Array.isArray(data) || isObject(data)))) {
    throw new Error("Missing Parameters");
  }
  if (Array.isArray(data)) {
    data = {
      [filename]: data
    };
  }
  const workbook = XLSX.utils.book_new();
  for (const [sheetName, sheetData] of Object.entries(data)) {
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const getDataFromSheet = (binaryString, readAsBinaryString, options = {}) => {
  const data = {};
  const workbook = XLSX.read(binaryString, {
    type: readAsBinaryString ? "binary" : "array"
  });
  workbook.SheetNames.forEach(sheetname => {
    const worksheet = workbook.Sheets[sheetname];
    data[sheetname] = XLSX.utils.sheet_to_json(worksheet, options);
    data[sheetname] = data[sheetname].map(row => {
      const parsedRow = {};
      Object.keys(row).forEach(colName => {
        parsedRow[camelcase(colName)] = row[colName];
      });
      return parsedRow;
    });
  });

  return data;
};
