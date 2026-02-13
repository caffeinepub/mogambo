import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { JobSource, JobListing, UserProfile, FetchType, Filter } from '../backend';
import { toast } from 'sonner';

// User Profile Queries
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
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to save profile: ' + error.message);
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Job Sources Queries
export function useGetJobSources() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobSource[]>({
    queryKey: ['jobSources'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJobSources();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddJobSource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; url: string; fetchType: FetchType }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addJobSource(params.name, params.url, params.fetchType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobSources'] });
      toast.success('Job source added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add source: ' + error.message);
    },
  });
}

export function useUpdateJobSource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; name: string; url: string; fetchType: FetchType }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJobSource(params.id, params.name, params.url, params.fetchType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobSources'] });
      toast.success('Job source updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update source: ' + error.message);
    },
  });
}

export function useToggleJobSource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; enabled: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleJobSource(params.id, params.enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobSources'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to toggle source: ' + error.message);
    },
  });
}

export function useDeleteJobSource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJobSource(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobSources'] });
      toast.success('Job source deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete source: ' + error.message);
    },
  });
}

// Job Search Query
export function useSearchJobs(keyword: string, location: string, filter: Filter | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobListing[]>({
    queryKey: ['searchJobs', keyword, location, filter],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchJobs(keyword, location, filter);
    },
    enabled: !!actor && !actorFetching && !!keyword,
    retry: 1,
  });
}
