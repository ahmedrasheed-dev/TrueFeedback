'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Loader2, Trash2 } from 'lucide-react';
import { Message } from '@/models/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: 'Message Deleted',
        description: response.data.message || 'Message was removed successfully.',
      });
      onMessageDelete(String(message._id));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-stone-200 bg-[#f9f7f4] shadow-[0_14px_35px_rgba(28,25,23,0.05)] transition-colors dark:border-stone-800 dark:bg-stone-900 dark:shadow-[0_14px_35px_rgba(0,0,0,0.18)]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base font-medium leading-6 text-stone-800 dark:text-stone-200">
            {message.content}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger render={
              <Button
                variant="ghost"
                size="icon"
                disabled={isDeleting}
                className="-mt-1 -mr-2 text-stone-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="sr-only">Delete message</span>
              </Button>
            } />
            <AlertDialogContent className="border-stone-200 bg-[#f9f7f4] dark:border-stone-800 dark:bg-stone-900">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-stone-900 dark:text-stone-100">
                  Delete Message?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-stone-600 dark:text-stone-400">
                  This action cannot be undone. This feedback message will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="h-9 rounded-xl border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="h-9 rounded-xl bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}