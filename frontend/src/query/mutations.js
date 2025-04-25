import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGetUser, apiLogin, apiLogout, apiRegister } from "../api/api";
import { toast, Bounce } from "react-toastify";
import { USER } from "./keys";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiLogin,
    onSuccess: async (data) => {
      const user = await apiGetUser();
      queryClient.setQueryData([USER], user);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || err?.message || "Ошибка входа";
      toast.error(msg);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiRegister,
    onSuccess: async (data) => {
      const user = await apiGetUser();
      queryClient.setQueryData([USER], user);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || err?.message || "Ошибка регистрации";
      toast.error(msg);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiLogout();
      queryClient.setQueryData([USER], null);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || err?.message || "Ошибка выхода";
      toast.error(msg);
    },
  });
};
