import { User } from "./user";
import { Score } from "./Score";

export class Game {

  id: number;
  name: string;
  full_name: string;
  scores: Score[];
  top_scorer: User;
  topScore: any;
}