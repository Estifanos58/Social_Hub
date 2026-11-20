export class EditPostCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
    public readonly content: string,
  ) {}
}
