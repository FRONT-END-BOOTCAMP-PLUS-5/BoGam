export class User {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly nickname?: string,
    public readonly username?: string,
    public readonly residentId?: string,
    public readonly password?: string,
    public readonly pinNumber?: string,
    public readonly phoneNumber?: string
  ) {}
}
