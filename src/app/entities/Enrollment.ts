import Entity from "@templates/Entity";

export default class Enrollment extends Entity {
  constructor(
    public readonly user_id: string,
    public readonly challenge_id: string,
    public readonly enrolled_at: Date | null,
    public readonly completed_at: Date | null,
  ) {
    super();
  }
}
