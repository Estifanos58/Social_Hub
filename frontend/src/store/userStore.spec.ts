import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './userStore';

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.getState().clearAuth();
  });

  it('should initialize with empty state', () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.usersToFollow).toEqual([]);
  });

  it('should set user and access token properly', () => {
    const mockUser = {
      id: 'usr-123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };

    useUserStore.getState().setUser(mockUser);
    useUserStore.getState().setAccessToken('jwt-token-abc');

    expect(useUserStore.getState().user).toEqual(mockUser);
    expect(useUserStore.getState().accessToken).toBe('jwt-token-abc');
  });

  it('should clear authentication state on clearAuth', () => {
    useUserStore.getState().setUser({
      id: 'usr-123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    });
    useUserStore.getState().setAccessToken('jwt-token-abc');
    useUserStore.getState().clearAuth();

    expect(useUserStore.getState().user).toBeNull();
    expect(useUserStore.getState().accessToken).toBeNull();
  });

  it('should manage usersToFollow and remove specific users', () => {
    const userA = {
      id: 'u-1',
      firstname: 'Alice',
      lastname: 'A',
      email: 'a@example.com',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };
    const userB = {
      id: 'u-2',
      firstname: 'Bob',
      lastname: 'B',
      email: 'b@example.com',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };

    useUserStore.getState().setUsersToFollow([userA, userB]);
    expect(useUserStore.getState().usersToFollow).toHaveLength(2);

    useUserStore.getState().removeUserFromToFollow('u-1');
    expect(useUserStore.getState().usersToFollow).toEqual([userB]);
  });
});
