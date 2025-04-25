import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetUser } from "../api/api";
import { USER } from "./keys";

export const useUser = () => {
  return useQuery({
    queryKey: [USER],
    queryFn: () => apiGetUser(),
  });
};
