export default class DuplicateEntryError extends Error {
  constructor(
    private msg: string = "Can't insert or update a duplicate entry"
  ) {
    super(msg);
  }
}
