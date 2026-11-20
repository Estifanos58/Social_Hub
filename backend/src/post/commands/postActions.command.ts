export class SavePostCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
  ) {}
}

export class UnsavePostCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
  ) {}
}

export class ReportPostCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
    public readonly reason: string,
  ) {}
}

export class NotInterestedPostCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
  ) {}
}
