import axios from 'axios';
import * as process from 'process';

const baseUrl = 'https://batch.geocoder.ls.hereapi.com/6.2/jobs';
const apiKeyEnv = process.env.HERE_API_KEY;

type GeocodeQueryParams = {
  action: 'run' | 'status';
  header: boolean;
  inDelim?: string;
  outDelim?: string;
  outCols: string;
  outputcombined: boolean;
  language: 'en-GB';
  apiKey: string;
};

type GeocodeStatusQueryParams = Pick<GeocodeQueryParams, 'action' | 'apiKey'>;

type GeocodeBatchSubmissionResponseDetails = {
  MetaInfo: { RequestId: 'string' };
  Status: 'accepted' | 'running' | 'completed';
  TotalCount: number;
  ValidCount: number;
  InvalidCount: number;
  ProcessedCount: number;
  PendingCount: number;
  SuccessCount: number;
  ErrorCount: number;
};

type GeocodeBatchSubmissionResponse = {
  Response: GeocodeBatchSubmissionResponseDetails;
};

export async function geocodeBatch(geocodeData: string, apiKey: string | null) {
  const key = apiKey || apiKeyEnv;
  if (!key) throw new Error('Missing API Key');

  const params: GeocodeQueryParams = {
    action: 'run',
    apiKey: key,
    header: true,
    language: 'en-GB',
    outCols: 'latitude,longitude,locationLabel,matchCode,matchType,relevance',
    outputcombined: true,
    inDelim: '|',
    outDelim: '|',
  };

  const { data } = await axios.post<GeocodeBatchSubmissionResponse>(baseUrl, geocodeData, {
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
    },
    params,
  });
  return data;
}

export async function getGeocodeStatus(requestId: string, apiKey: string | null) {
  const key = apiKey || apiKeyEnv;
  if (!key) throw new Error('Missing API Key');

  const params: GeocodeStatusQueryParams = {
    action: 'status',
    apiKey: key,
  };

  const { data } = await axios.get<GeocodeBatchSubmissionResponse>(`${baseUrl}/${requestId}`, {
    params,
  });
  return data;
}

export async function getGeocodeResult(requestId: string, apiKey: string | null) {
  const key = apiKey || apiKeyEnv;
  if (!key) throw new Error('Missing API Key');

  const params: GeocodeStatusQueryParams = {
    action: 'status',
    apiKey: key,
  };

  const { data } = await axios.get<ArrayBuffer>(`${baseUrl}/${requestId}/result`, {
    params,
    responseType: 'arraybuffer',
    headers: {
      accept: 'application/octet-stream;charset=utf-8',
    },
  });
  return data;
}
