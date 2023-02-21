import { read, utils, writeFileXLSX } from 'xlsx';
import { rmSync } from 'fs';
import { DateTime } from 'luxon';
import { getJsDateFromExcel } from 'excel-date-to-js';
import { parse, unparse } from 'papaparse';
import { join } from 'path';
import decompress from 'decompress';

import { objectKeys } from '../../utils/typeUtils';
import { readFileSync } from 'fs';

/**
 * Converts the first sheet in the provided xlsx file to JSON
 * @param file The XLSX to process
 * @param dateConfig The fields in the XLSX that contain dates
 * @param sheetName The name of the sheet to process
 */
export const parseExcelWorkbookSheet = <T>(
  file: Buffer,
  dateConfig?: {
    dateFields: (keyof T)[];
    dateFormat: string;
  },
  sheetName?: string | number,
): T[] => {
  const workbook = read(file);
  let sheetKey = sheetName;
  if (!sheetKey) {
    sheetKey = objectKeys(workbook.Sheets)[0];
  }
  const key = sheetKey;
  if (!key) {
    throw new Error('No sheet key found');
  }
  const sheet = workbook.Sheets[key];
  if (!sheet) {
    throw new Error('No sheet found');
  }
  const json = utils.sheet_to_json<T>(sheet);

  // TODO: Find a generic way to do this without needing to shut the compiler up
  json.forEach((row) => {
    dateConfig?.dateFields.forEach((field) => {
      if (row[field]) {
        const dateValue = getJsDateFromExcel(row[field] as unknown as number);
        row[field] = DateTime.fromJSDate(dateValue).toFormat(dateConfig.dateFormat) as unknown as T[keyof T];
      }
    });
  });
  return json;
};

export function convertJsonToCsv(data: Record<string, string>[]) {
  return unparse(data, {
    delimiter: '|',
    header: true,
    quotes: false,
  });
}

export async function createExcelWorkbook(inputFilename: string, outputFilename: string) {
  const TEMP_LOCATION = 'temp';
  const decompressed = await decompress(join(TEMP_LOCATION, inputFilename), TEMP_LOCATION); // this is a csv
  if (!decompressed?.[0]) throw new Error(`${inputFilename} could not be decompressed`);
  const workbook = utils.book_new();
  const filepath = join(TEMP_LOCATION, decompressed[0].path);
  console.log(`reading CSV from ${filepath}`);
  const csvFile = readFileSync(filepath);
  const csv = csvFile.toString();
  const parsed = parse(csv, {
    header: true,
    delimiter: '|',
    quoteChar: `'`,
    skipEmptyLines: true,
  });
  if (parsed.errors.length > 0) {
    console.error(JSON.stringify(parsed.errors, null, 2));
  }
  const worksheet = utils.json_to_sheet(parsed.data);
  utils.book_append_sheet(workbook, worksheet, 'geocode_data');
  await writeFileXLSX(workbook, outputFilename);
  rmSync(join(TEMP_LOCATION, inputFilename));
  rmSync(filepath);
}
