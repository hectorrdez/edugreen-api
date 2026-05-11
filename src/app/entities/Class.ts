import Entity from "@templates/Entity";

export default class Class extends Entity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly tutor_id: string,
    public readonly description: string | null,
    public readonly created_at: Date | null,
    public readonly updated_at: Date | null,
  ) {
    super();
  }
}
