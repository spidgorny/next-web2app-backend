"use client";

import useSWR, { SWRConfiguration } from "swr";

export function useSwrApi<DataType>(
  apiUrl: string,
  id?: string,
  options?: SWRConfiguration,
) {
  const list = useSWR<{ data: DataType[] }>(apiUrl, options);
  const item = useSWR<DataType>(id ? `${apiUrl}/${id}` : null, options);
  return { list: { ...list, data: list.data?.data ?? [] }, item };
}
