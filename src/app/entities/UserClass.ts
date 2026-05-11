import Entity from "@templates/Entity";

export default class UserClass extends Entity {
  constructor(
    public readonly user_id: string,
    public readonly class_id: string,
    public readonly joined_at: Date | null,
  ) {
    super();
  }
}
