
export class PartyManager {
  private static partyManagerInstance: PartyManager;

  private constructor() {}

  public static getInstance(): PartyManager {
    if (!this.partyManagerInstance) {
      this.partyManagerInstance = new PartyManager();
    }
    return this.partyManagerInstance;
  }
}
