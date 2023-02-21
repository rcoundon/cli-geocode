import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import * as listr from 'listr';
import { join } from 'path';
import { ListrTaskWrapper } from 'listr';

import { parseExcelWorkbookSheet, convertJsonToCsv, createExcelWorkbook } from '../services/file-parser/excelUtils';
import { geocodeBatch, getGeocodeResult, getGeocodeStatus } from '../services/geocoder';

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

function createFolderIfNotExists(folderName: string) {
  if (!existsSync(folderName)) {
    mkdirSync(folderName);
  }
}

export async function handleGeocodeFile(filename: string, apiKey: string | null, outputFile?: string) {
  const outputFilePath = outputFile ? join('output', outputFile) : join('output', `${new Date().valueOf()}-geocode.xlsx`);
  const tasks = new listr.default(
    [
      {
        title: 'Initialising directory structure',
        task: () => {
          createFolderIfNotExists('temp');
          createFolderIfNotExists('output');
        },
      },
      {
        title: 'Parsing Excel input file',
        task: (ctx) => {
          const file = readFileSync(filename);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ctx.parsedWorkbook = parseExcelWorkbookSheet<InputFormat>(file);
        },
      },
      {
        title: 'Converting to geocodable structure',
        task: (ctx) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
          ctx.geocodable = createGeocodeStructure(ctx.parsedWorkbook);
        },
      },
      {
        title: 'Converting to CSV for batch submission',
        task: (ctx) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
          ctx.geocodableCsv = convertJsonToCsv(ctx.geocodable);
        },
      },
      {
        title: 'Submitting geocode batch request',
        task: async (ctx) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
          ctx.batchResult = await geocodeBatch(ctx.geocodableCsv, apiKey);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
          ctx.requestId = ctx.batchResult.Response.MetaInfo.RequestId;
        },
      },
      {
        title: 'Waiting for geocode batch to process',
        task: async (ctx, task) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
          await retryUntilCompleted(ctx.requestId, apiKey, task, 20);
        },
      },
      {
        title: 'Getting geocode result',
        task: async (ctx) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
          ctx.result = await getGeocodeResult(ctx.requestId, apiKey);
        },
      },
      {
        title: 'Writing results to disk',
        task: async (ctx, task) => {
          const zipFilename = `${new Date().valueOf()}-geocode-results.zip`;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
          writeFileSync(`temp/${zipFilename}`, Buffer.from(ctx.result));
          task.title = `Writing ${outputFilePath} to disk`;
          await createExcelWorkbook(zipFilename, outputFilePath);
        },
      },
    ],
    {
      exitOnError: true,
    },
  );

  await tasks.run();
}

async function retryUntilCompleted(
  requestId: string,
  apiKey: string | null,
  task: ListrTaskWrapper,
  maxRetries = 50,
): Promise<boolean> {
  let retryCount = 0;
  let response;
  let status = '';
  do {
    task.title = `Checking status, attempt no. ${retryCount + 1}`;
    response = await getGeocodeStatus(requestId, apiKey);
    task.title = `Checking status, attempt no. ${retryCount + 1} status: ${response.Response.Status}`;
    status = response.Response.Status;
    retryCount++;
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
