
export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly user_type: String;
  readonly skin_type: String;
  readonly profile_pircture: String;
  readonly ban: Boolean;

}
