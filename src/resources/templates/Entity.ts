export default class Entity {
  public getAllData(): {} {
    return { ...this };
  }
  public copy(data: Partial<this>): this {
    return Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
      data
    );
  }
}
