export class HashManagerMock {
  public hash = async (plaintext: string): Promise<string> => {
    return "hash-mock";
  };

  public compare = async (
    plaintext: string,
    hash: string
  ): Promise<boolean> => {
    switch (plaintext) {
      case "user123":
        return hash === "hash-mock-normal";

      case "admin000":
        return hash === "hash-mock-admin";

      default:
        return false;
    }
  };
}
