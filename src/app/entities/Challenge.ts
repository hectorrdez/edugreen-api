import Entity from "@templates/Entity";

export default class Challenge extends Entity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly class_id: string,
    public readonly points: number,
    public readonly description: string | null,
    public readonly created_at: Date | null,
    public readonly updated_at: Date | null,
  ) {
    super();
  }
}
