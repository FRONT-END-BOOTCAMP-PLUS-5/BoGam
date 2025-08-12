export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly nickname: string,
    public readonly username: string,
    public readonly password: string,
    public readonly pinNumber: string,
    public readonly phoneNumber: string
  ) {}
}
