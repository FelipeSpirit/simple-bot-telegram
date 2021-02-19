import { Message } from "./message"

/**
 * The comand
 */
export class Command{ 
    /**
     * N names for the same actión
     */
    names:string[];

    /**
     * The action from command
     */
    listener:(message:Message) => void 
}