import { ApiBase } from "../api/APIBase";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class CredentialsService extends ApiBase {

    url = {
        post: 'credential'
    };

    constructor( private http : HttpClient) { super(http); }

    addCredential(data : any) {
        return this.put(this.url.post, data);
    }

}