import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetHabits, apiGetUser } from "../api/api";
import { HABITS, USER } from "./keys";

export const useUser = () => {
  return useQuery({
    queryKey: [USER],
    queryFn: apiGetUser,
    retry: 2,
  });
};

export const useHabits = () => {
  return useQuery({
    queryKey: [HABITS],
    queryFn: apiGetHabits,
    retry: 2,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
