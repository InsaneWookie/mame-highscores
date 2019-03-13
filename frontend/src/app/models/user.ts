export class User {


  id: number;
  username: string;
  email: string;
  points: number;
  userGroups: any = [];
  aliases: object[];

  current_password: string;
  new_password: string;
  repeat_new_password: string;



}
