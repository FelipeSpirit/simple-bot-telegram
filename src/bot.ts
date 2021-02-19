import EventEmitter = require('events');
import * as TelegramBot from 'node-telegram-bot-api';
import { Command } from './command';
import { Message } from './message';

export abstract class Bot{
    protected prefix:string;
    private token:string;
    private bot:TelegramBot;
    private emitter:EventEmitter;
    private commands:Command[];

    constructor(prefix:string, token:string){
        this.prefix = prefix;
        this.token = token;
        this.bot = new TelegramBot(this.token, { polling:true });
        console.log("Connected")
        this.emitter = new EventEmitter();
        this.commands = [];

        this.bot.onText(new RegExp(this.prefix), (message:Message)=>{
          if (!message.text.startsWith(this.prefix)) return;
          if (message.from.is_bot) return;
          message.response = this.bot;
          this.emitter.emit(this.getArguments(message.text)[0], message);
        })
        
        this.bot.on("polling_error", (msg) => console.log("Error",msg));

        this.init();
    }

    private setResponse(names:string[], listener:(message:Message) => void){
        names.forEach(e=>{
          this.emitter.on(e, listener);
        })
      }
    
      /**
       * Get arguments of the command
       * @param message content
       */
      getArguments(message:string){
        return message.slice(this.prefix.length).trim().split(/ +/g);
      }
    
      /**
       * Initialize the commands and custom configs;
       */
      protected abstract init():void;
    
      /**
       * Add n comands to the bot
       * @param commands The commands
       */
      addCommands(...commands:Command[]){
        commands.forEach(c=>{
          this.setResponse(c.names,c.listener);
        })
      }

    static fastBot(prefix:string, token:string, commands:Command[]):Bot{
        class CustomBot extends Bot{
            protected init(): void {
                this.addCommands(...commands);
            }
        }

        return new CustomBot(prefix, token);
    }
}