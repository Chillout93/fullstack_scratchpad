import { useLiveQuery } from "dexie-react-hooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { db } from "./db";
import { axiosGet } from "./axios";

export const useQuery = <T extends {}>(url: string, setActiveQueries: Dispatch<SetStateAction<Record<string, () => Promise<void>>>>) : {
  data: T | undefined;
  setData: (updateFn: T | ((prev: T) => T)) => Promise<void>;
  mutate: () => void
  error: JSON | undefined;
  loading: boolean;
} => {
  const [error, setError] = useState<JSON>();
  const [loading, setLoading] = useState(true);

  const data = useLiveQuery(() => db.response_cache.get(url));

  const query = async () => {
    if (navigator.onLine) {
        setLoading(true);
        const result = await axiosGet<T>(url) 
        if (result.status === 'ERROR') {
          setError(result.message)
        } else {
          await db.response_cache.put({ key: url, value: result.data, received_at: new Date() });
        }
        
        setLoading(false);
    }
  }

  useEffect(() => {
    query()
    setActiveQueries(prev => ({ ...prev, [url]: query }))

    return setActiveQueries(prev => { 
      const { url, ...rest } = prev
      return rest
    })
  }, []);

  // Type guard to check if updateFn is a function
  const isFunction = (fn: T | ((prev: T) => T)): fn is (prev: T) => T => {
    return typeof fn === 'function';
  };

  const setData = async (updateFn?: T | ((prev: T) => T)) => {
    const existing = await db.response_cache.get(url);

    const updated = isFunction(updateFn!)
      ? updateFn(existing?.value as T) 
      : updateFn; 

    await db.response_cache.update(url, { value: updated });
  };

  return { data: data?.value as T | undefined, error, loading: (loading && navigator.onLine) || !data, setData, mutate: query };
};
