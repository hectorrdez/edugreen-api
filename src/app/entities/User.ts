import Entity from "../../resources/templates/Entity";

export default class User extends Entity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public old_password: string | null,
    public readonly role: 'student' | 'teacher' | 'admin',
    public readonly points: number,
    public readonly institution_id: string | null,
    public readonly created_at: Date | null,
    public readonly updated_at: Date | null,
    public readonly last_login_at: Date | null,
  ) {
    super();
  }
}
