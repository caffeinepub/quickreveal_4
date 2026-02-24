import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, AppUserRole, BookingStatus } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Pro Profiles ─────────────────────────────────────────────────────────────

export function useGetProProfile(proId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['proProfile', proId],
    queryFn: async () => {
      if (!actor || !proId) throw new Error('Actor or proId not available');
      const { Principal } = await import('@dfinity/principal');
      return actor.getProProfile(Principal.fromText(proId));
    },
    enabled: !!actor && !actorFetching && !!proId && !!identity,
    retry: false,
  });
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export function useGetBookingsByProfessional(proId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['bookingsByPro', proId],
    queryFn: async () => {
      if (!actor || !proId) return [];
      const { Principal } = await import('@dfinity/principal');
      return actor.getBookingsByProfessional(Principal.fromText(proId));
    },
    enabled: !!actor && !actorFetching && !!proId && !!identity,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
}

export function useGetBookingsByUser(userId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['bookingsByUser', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      const { Principal } = await import('@dfinity/principal');
      return actor.getBookingsByUser(Principal.fromText(userId), null);
    },
    enabled: !!actor && !actorFetching && !!userId && !!identity,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
}

export function useCreateBookingRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      proId: string;
      serviceId: string;
      date: string;
      timeSlot: string;
      address: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      return actor.createBookingRequest(
        Principal.fromText(params.proId),
        params.serviceId,
        params.date,
        params.timeSlot,
        params.address
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingsByUser'] });
      queryClient.invalidateQueries({ queryKey: ['bookingsByPro'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { bookingId: string; status: BookingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateBookingStatus(params.bookingId, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingsByPro'] });
      queryClient.invalidateQueries({ queryKey: ['bookingsByUser'] });
    },
  });
}

// ─── Notifications (local polling simulation) ─────────────────────────────────

export function useNotificationsPolling(enabled: boolean) {
  return useQuery({
    queryKey: ['notifications-poll'],
    queryFn: async () => {
      return { timestamp: Date.now() };
    },
    enabled,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
}
