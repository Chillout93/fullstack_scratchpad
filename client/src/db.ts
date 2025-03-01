import Dexie, { type EntityTable } from 'dexie'
import { orderBy, uniq } from 'lodash'
import { axiosMutate } from './axios'

type ResponseCache = {
  key: string
  received_at: Date
  value: unknown
}

export type RequestCache = {
  uuid: string;
  method: 'POST' | 'PATCH' | 'DELETE';
  url: string;
  body: any;
  status: 'queued' | 'success' | 'failed';
  errorMessage?: JSON;
  timestamp: number;
  mutateKeys: string[];
}

export const processQueue = async (activeQueries: Record<string, () => void>) => {
  const requests = orderBy(await db.request_cache.toArray(), x => x.timestamp)

  for (const request of requests) {
      const response = await axiosMutate(request.url, request.method, request.body)

      if (response.status !== 'ERROR') {
        await db.request_cache.delete(request.uuid);
      } else {
        await db.request_cache.update(request.uuid, { status: 'failed', errorMessage: response.message })
        break
      }
  }

  if (requests.length > 0) {
    const keys = uniq(requests.flatMap(x => x.mutateKeys))
    await Promise.all(keys.map(async x => await activeQueries[x]() ))
  }
};

export const db = new Dexie('todo') as Dexie & {
  response_cache: EntityTable<ResponseCache, 'key'>
  request_cache: EntityTable<RequestCache, 'uuid'>
};

// Schema declaration:
db.version(1).stores({
  response_cache: 'key',
  request_cache: 'uuid,status'
});
