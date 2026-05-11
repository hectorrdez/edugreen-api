import Entity from "@templates/Entity";

export default class Institution extends Entity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly student_domain: string,
    public readonly teacher_domain: string,
    public readonly created_at: Date | null,
  ) {
    super();
  }
}
