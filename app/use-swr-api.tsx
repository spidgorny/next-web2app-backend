"use client";

import useSWR from "swr";

export function useSwrApi(apiUrl: string, id?: string) {
  const list = useSWR(apiUrl);
  const item = useSWR(id ? `${apiUrl}/${id}` : null);
  return { list: { ...list, data: list.data?.data ?? [] }, item };
}
