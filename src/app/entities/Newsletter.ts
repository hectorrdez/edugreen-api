import Entity from "@templates/Entity";

export default class Newsletter extends Entity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly active: boolean,
    public readonly subscribed_at: Date | null,
    public readonly unsubscribed_at: Date | null,
  ) {
    super();
  }
}
