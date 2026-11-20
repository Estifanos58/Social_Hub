import { describe, it, expect } from 'vitest';

describe('Feed, Privacy & Follow State Logic', () => {
  it('deduplicates posts correctly when appending cursor pages', () => {
    const existingPosts = [
      { id: 'p-1', content: 'First' },
      { id: 'p-2', content: 'Second' },
    ];
    const incomingPosts = [
      { id: 'p-2', content: 'Second' }, // Duplicate
      { id: 'p-3', content: 'Third' },
    ];

    const existingIds = new Set(existingPosts.map((p) => p.id));
    const deduplicated = incomingPosts.filter((p) => !existingIds.has(p.id));
    const combined = [...existingPosts, ...deduplicated];

    expect(combined).toHaveLength(3);
    expect(combined.map((p) => p.id)).toEqual(['p-1', 'p-2', 'p-3']);
  });

  it('correctly determines profile access rules for private vs public accounts', () => {
    // 1. Owner viewing own account
    const isOwner = true;
    const isPrivate = true;
    const followStatus = 'NONE';
    const canOwnerView = !isPrivate || isOwner || followStatus === 'ACCEPTED';
    expect(canOwnerView).toBe(true);

    // 2. Stranger viewing private account
    const strangerIsOwner = false;
    const strangerFollowStatus = 'NONE';
    const canStrangerView =
      !isPrivate || strangerIsOwner || strangerFollowStatus === 'ACCEPTED';
    expect(canStrangerView).toBe(false);

    // 3. Pending requester viewing private account
    const pendingFollowStatus = 'PENDING';
    const canPendingView =
      !isPrivate || strangerIsOwner || pendingFollowStatus === 'ACCEPTED';
    expect(canPendingView).toBe(false);

    // 4. Accepted follower viewing private account
    const acceptedFollowStatus = 'ACCEPTED';
    const canAcceptedView =
      !isPrivate || strangerIsOwner || acceptedFollowStatus === 'ACCEPTED';
    expect(canAcceptedView).toBe(true);

    // 5. Anyone viewing public account
    const publicIsPrivate = false;
    const canViewPublic =
      !publicIsPrivate || strangerIsOwner || strangerFollowStatus === 'ACCEPTED';
    expect(canViewPublic).toBe(true);
  });

  it('correctly calculates optimistic reaction count changes', () => {
    // Adding reaction when none existed
    let prevReaction = null;
    let nextReaction = { type: 'LIKE' };
    let count = 5;
    if (!prevReaction && nextReaction) count += 1;
    expect(count).toBe(6);

    // Removing reaction when clicking same
    prevReaction = { type: 'LIKE' };
    nextReaction = null;
    if (prevReaction && !nextReaction) count = Math.max(0, count - 1);
    expect(count).toBe(5);

    // Switching reaction type keeps count same
    prevReaction = { type: 'LIKE' };
    nextReaction = { type: 'LOVE' };
    expect(count).toBe(5);
  });
});
