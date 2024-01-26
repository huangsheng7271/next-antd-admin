import { useMutation, useQueryClient } from "@tanstack/react-query";
import accountService from "@/api/services/accountService";
import { message } from "antd";

export const useAddAccountMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: accountService.addAccount,
    onSuccess: () => {
      message.success('Add Account Success');
      client.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useUpdateAccountMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: accountService.updateAccount,
    onSuccess: () => {
      message.success('Update Account Success');
      client.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useDeleteAccountMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: accountService.deleteAccount,
    onSuccess: () => {
      message.success('Delete Account Success');
      client.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useRefreshAccountMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: accountService.refreshAccount,
    onSuccess: () => {
      message.success('Refresh Account Success');
      client.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};
