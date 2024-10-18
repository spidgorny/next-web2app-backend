"use client";

import useSWR from "swr";

export function useSwrApi<DataType>(apiUrl: string, id?: string) {
  const list = useSWR<{ data: DataType[] }>(apiUrl);
  const item = useSWR<DataType>(id ? `${apiUrl}/${id}` : null);
  return { list: { ...list, data: list.data?.data ?? [] }, item };
}
