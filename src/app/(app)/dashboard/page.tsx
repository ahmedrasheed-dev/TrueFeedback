'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { MessageCard } from '@/components/MessageCard';
import { MessageSkeleton } from '@/components/MessageSkeleton';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/models/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const initializedUserId = useRef<string | null>(null);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages((currentMessages) => currentMessages.filter((message) => String(message._id) !== messageId));
  };

  const { data: session, status } = useSession();

  const form = useForm<{ acceptMessages: boolean }>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { acceptMessages: false },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', Boolean(response.data.data?.isAcceptingMessages));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.data || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || initializedUserId.current === userId) return;

    initializedUserId.current = userId;

    fetchMessages();
    fetchAcceptMessages();
  }, [session?.user?.id, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  const isSessionLoading = status === 'loading';
  const user = session?.user as User | undefined;
  const username = user?.username;

  const baseUrl = typeof window === 'undefined' ? '' : `${window.location.protocol}//${window.location.host}`;
  const profileUrl = username ? `${baseUrl}/u/${username}` : '';

  const copyToClipboard = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  if (status === 'unauthenticated') {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-8 text-stone-900 transition-colors dark:text-stone-100">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Please sign in to access your dashboard.</p>
          <Link href="/sign-in" className="mt-5 inline-block">
            <Button className="h-10 rounded-xl bg-stone-900 px-5 text-sm text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
              Sign In
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-8 text-stone-900 transition-colors dark:text-stone-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header section with fixed layout */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Your space</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
              {isSessionLoading || !username ? (
                <span className="inline-flex items-center gap-2">
                  Welcome back, <Skeleton className="h-8 w-44 rounded-lg" />
                </span>
              ) : (
                `Welcome back, ${username}.`
              )}
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Manage your anonymous feedback from one quiet place.</p>
          </div>
          <Button variant="outline" onClick={() => fetchMessages(true)} disabled={isLoading || isSessionLoading} className="h-11 rounded-xl border-stone-200 bg-white px-4 text-sm text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
            Refresh messages
          </Button>
        </div>

        {/* Feedback link section */}
        <section className="border-y border-stone-200 py-6 dark:border-stone-800">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Your feedback link</p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Share this link to receive anonymous messages.</p>
            </div>
            <div className="flex w-full gap-2 lg:max-w-xl">
              {isSessionLoading || !profileUrl ? (
                <Skeleton className="h-11 flex-1 rounded-xl" />
              ) : (
                <input type="text" value={profileUrl} readOnly aria-label="Your feedback profile link" className="h-11 min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-600 outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300" />
              )}
              <Button onClick={copyToClipboard} disabled={isSessionLoading || !profileUrl} className="h-11 rounded-xl bg-stone-900 px-4 text-sm text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">Copy link</Button>
            </div>
          </div>
        </section>

        {/* Accept messages switch section */}
        <section className="flex flex-col justify-between gap-4 border-b border-stone-200 py-6 sm:flex-row sm:items-center dark:border-stone-800">
          <div>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Accept new messages</p>
            <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {isSessionLoading ? (
                <Skeleton className="inline-block h-4 w-48 rounded" />
              ) : (
                acceptMessages ? 'Your profile is open to feedback.' : 'Your profile is currently closed.'
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-stone-600 dark:text-stone-400">{acceptMessages ? 'On' : 'Off'}</span>
            <Switch checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading || isSessionLoading} aria-label="Accept new messages" />
          </div>
        </section>

        {/* Message section header */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.04em]">Recent messages</h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Private responses from your community.</p>
          </div>
        </div>

        {/* Messages Grid / Skeletons */}
        <Suspense fallback={<MessageSkeleton />}>
          {isLoading || isSessionLoading ? (
            <MessageSkeleton />
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={String(message._id)}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 py-12 text-center text-sm text-stone-500 dark:border-stone-800 dark:bg-stone-900/30 dark:text-stone-400 md:col-span-2">
                  No messages yet. Your feedback will appear here.
                </p>
              )}
            </div>
          )}
        </Suspense>
      </div>
    </main>
  );
}

export default UserDashboard;