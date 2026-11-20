export class CancelFollowRequestCommand {
  constructor(
    public readonly userId: string,
    public readonly followingId: string,
  ) {}
}
