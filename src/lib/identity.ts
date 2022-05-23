export class Identity {
  private static id = 0;
  static next() {
    return this.id++;
  }
}
