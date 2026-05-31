import Entity from "@templates/Entity";

export default class Challenge extends Entity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly class_id: string,
    public readonly points: number,
    public readonly auto_enroll: boolean,
    public readonly description: string | null,
    public readonly image: string | null,
    public readonly created_at: Date | null,
    public readonly updated_at: Date | null,
    public readonly participants: number = 0,
  ) {
    super();
  }
}
