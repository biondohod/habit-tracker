import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiCreateHabit,
  apiDeleteHabit,
  apiGetUser,
  apiLogin,
  apiLogout,
  apiRegister,
  apiUpdateHabit,
} from "../api/api";
import { toast, Bounce } from "react-toastify";
import { HABITS, USER } from "./keys";

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

// add redirect to habits page after success
export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (habit) => {
      await apiCreateHabit(habit);
      queryClient.invalidateQueries([HABITS]);
    },
    onSuccess: () => {
      toast.success("Привычка успешно создана!");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Ошибка создания привычки";
      toast.error(msg);
    },
  });
};

export const useUpdateHabit = (showMotivation = false) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, habit }) => {
      await apiUpdateHabit(id, habit);
      queryClient.invalidateQueries([HABITS]);
    },
    onSuccess: () => {
      toast.success(
        showMotivation
          ? "Главное - не сдаваться!"
          : "Привычка успешно обновлена!"
      );
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Ошибка обновления привычки";
      toast.error(msg);
    },
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await apiDeleteHabit(id);
      queryClient.invalidateQueries([HABITS]);
    },
    onSuccess: () => {
      toast.success("Привычка успешно удалена!");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Ошибка удаления привычки";
      toast.error(msg);
    },
  });
};
