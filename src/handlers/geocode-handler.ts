import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { SingleBar } from 'cli-progress';
import * as colors from 'ansi-colors';

import { parseExcelWorkbookSheet, convertJsonToCsv, createExcelWorkbook } from '../services/file-parser/excelUtils';
import { geocodeBatch, getGeocodeResult, getGeocodeStatus } from '../services/geocoder';
import { join } from 'path';

let progressBar: SingleBar;

type Geocodable = {
  recId: string;
  address?: string;
  country: string;
  searchText?: string;
};

type InputFormat = {
  address_id: number;
  external_ref?: string;
  name?: string;
  address: string;
  second_address?: string;
  third_address?: string;
  city: string;
  postcode?: string;
  country: 'IE';
};

export async function handleGeocodeFile(filename: string, apiKey: string | null, outputFile?: string) {
  const outputFilePath = outputFile || join('output', `${new Date().valueOf()}-geocode.xlsx`);
  mkdirSync('temp', {
    recursive: true,
  });
  progressBar = new SingleBar({
    format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% || Status: {status}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });
  progressBar.start(100, 0);
  const file = readFileSync(filename);
  progressBar.increment(5, {
    status: 'Parsing Excel document',
  });
  const parsedWorkbook = parseExcelWorkbookSheet<InputFormat>(file);

  const geocodable = createGeocodeStructure(parsedWorkbook);
  progressBar.increment(5, {
    status: 'Converting to geocodable structure',
  });

  progressBar.increment(5, {
    status: 'Creating geocode batch request string',
  });
  const geocodableCsv = convertJsonToCsv(geocodable);

  progressBar.increment(5, {
    status: 'Submitting geocode batch request',
  });
  const batchResult = await geocodeBatch(geocodableCsv, apiKey);
  const requestId = batchResult.Response.MetaInfo.RequestId;
  progressBar.increment(5, {
    status: `RequestId ${requestId} accepted`,
  });

  const done = await retryUntilCompleted(requestId, apiKey, 20);
  if (done) {
    const result = await getGeocodeResult(requestId, apiKey);
    const zipFilename = `${new Date().valueOf()}-geocode-results.zip`;
    writeFileSync(`temp/${zipFilename}`, Buffer.from(result));
    await createExcelWorkbook(zipFilename, outputFilePath);

    progressBar.update(100, {
      status: 'geocode complete',
    });
    progressBar.stop();
    console.log(`Results file ${outputFilePath} created`);
  } else {
    console.log('Something unexpected went wrong');
  }
}

async function retryUntilCompleted(requestId: string, apiKey: string | null, maxRetries = 10): Promise<boolean> {
  let retryCount = 0;
  let response;
  let status = '';
  do {
    // console.log(`Checking status, attempt no. ${retryCount + 1}`);
    response = await getGeocodeStatus(requestId, apiKey);
    status = response.Response.Status;
    progressBar.increment(5);
    retryCount++;
    await new Promise((resolve) => setTimeout(resolve, 3000));
  } while (status !== 'completed' && retryCount < maxRetries);

  if (status === 'completed') {
    return true;
  } else {
    throw new Error(`Max retries of ${maxRetries} reached without completing successfully.`);
  }
}

function createGeocodeStructure(data: InputFormat[]) {
  return data.map((item) => {
    const output = {} as Geocodable;
    let address = '';
    if (item.name) address += item.name;
    if (item.address) address += ` ${item.address}`;
    if (item.second_address) address += ` ${item.second_address}`;
    if (item.third_address) address += ` ${item.third_address}`;
    if (item.city) address += ` ${item.city}`;
    if (item.postcode) address += ` ${item.postcode}`;
    output.searchText = address;
    output.recId = String(item.address_id);
    output.country = item.country;
    return output;
  });
}
