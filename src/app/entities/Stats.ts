import Entity from "@templates/Entity";

export default class Stats extends Entity {
  constructor(
    public readonly user_id: string,
    public readonly challenge_id: string,
    public readonly points: number,
    public readonly earned_at: Date | null,
  ) {
    super();
  }
}
