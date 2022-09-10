import { Channel } from "phoenix";

export interface BoardContextType {
  boardChannel?: Channel;
  addSticky?: (newSticky: Partial<Sticky>) => Promise<void>;
}
