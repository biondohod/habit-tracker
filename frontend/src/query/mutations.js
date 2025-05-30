import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiCreateHabit,
  apiDeleteHabit,
  apiDeleteUser,
  apiGetUser,
  apiLogin,
  apiLogout,
  apiRegister,
  apiUpdateHabit,
  apiUpdateUser,
  apiUpdateUserPassword,
} from "../api/api";
import { toast, Bounce } from "react-toastify";
import { HABITS, USER } from "./keys";

// Auth mutations
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
      queryClient.removeQueries([HABITS]);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || err?.message || "Ошибка выхода";
      toast.error(msg);
    },
  });
};

// User mutations
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await apiDeleteUser(id);
      queryClient.setQueryData([USER], null);
      queryClient.removeQueries([HABITS]);
    },
    onSuccess: async () => {
      toast.success("Пользователь успешно удален!");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || err?.message || "Ошибка удаления";
      toast.error(msg);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userData }) => {
      console.log(id, userData);
      await apiUpdateUser(id, userData);
      queryClient.invalidateQueries([USER]);
    },
    onSuccess: async () => {
      toast.success("Пользователь успешно изменен!");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Ошибка редактирования пользователя";
      toast.error(msg);
    },
  });
};

export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, passwords }) => {
      await apiUpdateUserPassword(id, passwords);
      queryClient.invalidateQueries([USER]);
    },
    onSuccess: async () => {
      toast.success("Пароль успешно изменен!");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Ошибка редактирования пароля";
      toast.error(msg);
    },
  });
};

// Habits mutations
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
