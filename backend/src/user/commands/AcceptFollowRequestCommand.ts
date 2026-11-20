export class AcceptFollowRequestCommand {
  constructor(
    public readonly userId: string,
    public readonly followerId: string,
  ) {}
}
