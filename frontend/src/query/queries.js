import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetHabit, apiGetHabits, apiGetUser } from "../api/api";
import { HABIT, HABITS, USER } from "./keys";

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

export const useHabit = (id, enabled = true) => {
  return useQuery({
    queryKey: [HABIT, id],
    queryFn: () => apiGetHabit(id),
    enabled: enabled && !!id,
    retry: 1,
  });
};
