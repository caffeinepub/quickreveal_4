import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  UserProfile,
  ProProfile,
  Booking,
  BookingStatus,
  Service,
  WeeklyAvailability,
  ExternalBlob,
} from '../backend';
import { AppUserRole } from '../backend';

// ─── User Profile ───────────────────────────────────────────────────────────

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

// ─── Pro Profile ─────────────────────────────────────────────────────────────

export function useGetProProfile(proId?: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ProProfile | null>({
    queryKey: ['proProfile', proId ?? identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const id = proId ?? identity?.getPrincipal().toString();
      if (!id) return null;
      try {
        const { Principal } = await import('@dfinity/principal');
        return await actor.getProProfile(Principal.fromText(id));
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateOrUpdateProProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (profile: ProProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createOrUpdateProProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proProfile', identity?.getPrincipal().toString()] });
      queryClient.invalidateQueries({ queryKey: ['activePros'] });
    },
  });
}

export function usePublishProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.publishProfile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proProfile', identity?.getPrincipal().toString()] });
      queryClient.invalidateQueries({ queryKey: ['activePros'] });
    },
  });
}

export function useUpdateServices() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (services: Service[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateServices(services);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proProfile', identity?.getPrincipal().toString()] });
    },
  });
}

export function useUpdateGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ mainPhoto, galleryPhotos }: { mainPhoto: ExternalBlob | null; galleryPhotos: ExternalBlob[] }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateGallery(mainPhoto, galleryPhotos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proProfile', identity?.getPrincipal().toString()] });
    },
  });
}

export function useUpdateWeeklyAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (availability: WeeklyAvailability) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateWeeklyAvailability(availability);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proProfile', identity?.getPrincipal().toString()] });
    },
  });
}

// ─── Active Pros (Explorer) ──────────────────────────────────────────────────

export function useActivePros(centerLat = 46.8, centerLong = 8.2, radius = BigInt(50), category?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProProfile[]>({
    queryKey: ['activePros', centerLat, centerLong, radius.toString(), category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterProsByLocation(centerLat, centerLong, radius, category ?? null);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useFlashPros() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProProfile[]>({
    queryKey: ['flashPros'],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.filterProsByLocation(46.8, 8.2, BigInt(50), null);
      return all.filter((p) => p.subscriptionStatus);
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export function useMyBookings() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Booking[]>({
    queryKey: ['myBookings', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getBookingsByUser(identity.getPrincipal(), null);
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 30000,
  });
}

export function useRadarDemandes() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Booking[]>({
    queryKey: ['radarDemandes', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getBookingsByProfessional(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 15000,
  });
}

export function useCreateBooking() {
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
      proId: string;
      serviceId: string;
      date: string;
      timeSlot: string;
      address: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      return actor.createBookingRequest(Principal.fromText(proId), serviceId, date, timeSlot, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['radarDemandes'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateBookingStatus(bookingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['radarDemandes'] });
    },
  });
}

// ─── Wallet (derived from bookings) ─────────────────────────────────────────

export function useWalletSolde() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<number>({
    queryKey: ['walletBalance', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return 0;
      const proBookings = await actor.getBookingsByProfessional(identity.getPrincipal());
      const confirmed = proBookings.filter((b) => b.status === 'confirmed');
      return confirmed.reduce((sum, b) => sum + Number(b.totalPrice), 0);
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 30000,
  });
}

// ─── Notifications (local, derived from bookings) ────────────────────────────

export function useMyNotifications() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<AppNotification[]>({
    queryKey: ['myNotifications', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const principal = identity.getPrincipal();
      const [clientBookings, proBookings] = await Promise.all([
        actor.getBookingsByUser(principal, null).catch(() => [] as Booking[]),
        actor.getBookingsByProfessional(principal).catch(() => [] as Booking[]),
      ]);

      const notifications: AppNotification[] = [];

      proBookings.forEach((b) => {
        if (b.status === 'pending') {
          notifications.push({
            id: `nd-${b.id}`,
            type: 'nouvelle_demande',
            bookingId: b.id,
            timestamp: Date.now(),
            read: false,
          });
        }
        if (b.status === 'confirmed') {
          notifications.push({
            id: `bc-${b.id}`,
            type: 'booking_confirme',
            bookingId: b.id,
            timestamp: Date.now(),
            read: false,
          });
        }
      });

      clientBookings.forEach((b) => {
        if (b.status === 'confirmed') {
          notifications.push({
            id: `pc-${b.id}`,
            type: 'paiement_confirme',
            bookingId: b.id,
            timestamp: Date.now(),
            read: false,
          });
        }
      });

      return notifications;
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 15000,
  });
}

export interface AppNotification {
  id: string;
  type: 'nouvelle_demande' | 'paiement_confirme' | 'fonds_liberes' | 'avis_recu' | 'booking_confirme';
  bookingId?: string;
  timestamp: number;
  read: boolean;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export function useAdminAllPros() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProProfile[]>({
    queryKey: ['adminPros'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminGetAllPros();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useAdminAllBookings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminGetAllBookings();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useAdminMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ totalBookings: bigint; totalActivePros: bigint; totalRegisteredUsers: bigint }>({
    queryKey: ['adminMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminGetMetrics();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useAdminValidatePro() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proId: string) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      await actor.adminValidatePro(Principal.fromText(proId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPros'] });
      queryClient.invalidateQueries({ queryKey: ['activePros'] });
    },
  });
}

// ─── Stripe ──────────────────────────────────────────────────────────────────

export function useIsStripeConfigured() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export { AppUserRole };
