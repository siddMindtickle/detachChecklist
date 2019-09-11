import React from "react";
import PropTypes from "prop-types";
import XLSX from "xlsx";
import { isString } from "@utils";

class CsvParse extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired
  };

  formatFileResult(file) {
    const { fileHeaders = [], onDataUploaded } = this.props;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const worksheet = XLSX.read(reader.result, { type: "binary" }).Sheets.Sheet1;
      let cellAddress;
      let cellValue;
      fileHeaders.forEach((header, index) => {
        cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
        if (Array.isArray(header)) {
          cellValue = header[0];
        } else if (isString(header)) {
          cellValue = header;
        }
        worksheet[cellAddress] = { t: "s", v: cellValue };
      });
      let result = [];
      if (cellAddress) {
        const lastColumnStart = XLSX.utils.decode_cell(cellAddress);
        const { s: startCell, e: endCell } = XLSX.utils.decode_range(worksheet["!ref"]);
        worksheet["!ref"] = XLSX.utils.encode_range({
          s: startCell,
          e: { r: endCell.r, c: lastColumnStart.c }
        });
        result = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: "" });
      }
      onDataUploaded(result);
    };
  }

  handleOnChange = event => {
    const file = event.target.files[0];
    this.formatFileResult(file);
  };

  render() {
    return this.props.render(this.handleOnChange);
  }
}

CsvParse.propTypes = {
  fileHeaders: PropTypes.array.isRequired,
  onDataUploaded: PropTypes.func.isRequired
};

export default CsvParse;
