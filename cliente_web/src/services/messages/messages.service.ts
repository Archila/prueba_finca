import { ApiBase } from "../api/APIBase";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class MessagesService extends ApiBase {

    url = {
        get: 'messages',
        post: 'messaqe',
        get_id: 'message',
        get_tags: 'messages'
    };

    constructor( private http : HttpClient) { super(http); }

    getMessages() {
        return this.get(this.url.get);
    }

    addMessage(data : any) {
        return this.post(this.url.post, data);
    }

    getMessage(message_id : any, data : any) {
        return this.get(this.url.get_id + '/' + message_id, data);
    }

    getMessagesTags(tag : any, data : any) {
        return this.get(this.url.get_tags + '/' + tag, data);
    }

}