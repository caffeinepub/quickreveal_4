import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, ProProfile, BookingStatus, Booking } from '../backend';
import { Principal } from '@dfinity/principal';

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
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetProProfile(proId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProProfile>({
    queryKey: ['proProfile', proId?.toString()],
    queryFn: async () => {
      if (!actor || !proId) throw new Error('Actor or proId not available');
      return actor.getProProfile(proId);
    },
    enabled: !!actor && !actorFetching && !!proId,
    retry: false,
  });
}

export function useFilterProsByLocation(
  centerLat: number,
  centerLong: number,
  radius: bigint,
  category: string | null
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProProfile[]>({
    queryKey: ['prosByLocation', centerLat, centerLong, radius.toString(), category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterProsByLocation(centerLat, centerLong, radius, category);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetBookingsByUser(userId: Principal | null, status: BookingStatus | null = null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookingsByUser', userId?.toString(), status],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getBookingsByUser(userId, status);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useGetBookingsByProfessional(proId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookingsByProfessional', proId?.toString()],
    queryFn: async () => {
      if (!actor || !proId) return [];
      return actor.getBookingsByProfessional(proId);
    },
    enabled: !!actor && !actorFetching && !!proId,
  });
}

export function useCreateBookingRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      proId,
      serviceId,
      date,
      timeSlot,
      address,
    }: {
      proId: Principal;
      serviceId: string;
      date: string;
      timeSlot: string;
      address: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBookingRequest(proId, serviceId, date, timeSlot, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingsByUser'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: BookingStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(bookingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingsByUser'] });
      queryClient.invalidateQueries({ queryKey: ['bookingsByProfessional'] });
    },
  });
}

export function useCreateOrUpdateProProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ProProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateProProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proProfile'] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isStripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !actorFetching,
  });
}
