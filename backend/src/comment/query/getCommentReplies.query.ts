export class GetCommentRepliesQuery {
  constructor(
    public readonly commentId: string,
    public readonly first: number = 5,
    public readonly after?: string,
    public readonly includeChildren: boolean = true,
    public readonly secondLevelLimit: number = 5,
    public readonly userId?: string,
  ) {}
}
