export class RejectFollowRequestCommand {
  constructor(
    public readonly userId: string,
    public readonly followerId: string,
  ) {}
}
