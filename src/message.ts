export class Message {
    message_id:number;
    from:{id:number, is_bot: boolean, first_name: string, language_code: string};
    chat: { id: number, first_name: string, type: string };
    date: number;
    text: string;
    entities:{offset:number, length:number, type:string}[]
    response:TelegramBot;
}

abstract class TelegramBot{
    abstract sendMessage(chatId, text, form?:any):Promise<Message>;
}