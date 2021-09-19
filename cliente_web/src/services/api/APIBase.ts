import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import * as CryptoJS from 'crypto-js';

import { environment } from '../../environments/environment';


export abstract class ApiBase {
    private baseUrl = environment['api'].endpoint;
    private _http;
    
    
    constructor (_http: HttpClient) { 
        this._http = _http;
    }

    protected get(url: string, params? : {[key: string] : any;},) {
        
        let headers = this.setHeaders(url);

        if (params) {
            var _httpParams = new HttpParams({
                fromObject: params
            });
            return this._http.get(this.baseUrl + url, { params: _httpParams, headers: headers, observe: 'response' });
        }
        return this._http.get(this.baseUrl + url , {headers: headers, observe: 'response'});
    }

    protected post(url : string, data : {[key: string] : any;}) {
        let headers = this.setHeaders(url);
        
        return this._http.post(this.baseUrl + url, data, {headers: headers, observe: 'response'});
       
    }

    protected put(url : string, data : {[key: string] : any;}, headers? : any) {
        if(headers) {
            var _headers = new HttpHeaders({
                fromObject: headers
            });
            return this._http.put(this.baseUrl + url, data, {headers: _headers, observe: 'response'});
        }
        return this._http.put(this.baseUrl + url, data);
    }

    protected delete(url : string, data? : {[key: string] : any;}) {
        if (data) {
            return this._http.request('delete', this.baseUrl + url, {body: data});
        }
        return this._http.delete(this.baseUrl + url);
    }
    
    //Function to add headers to the route, using HMA-SHA256
    setHeaders(url:string){
        let headers = new HttpHeaders({
            "content-type": "application/json"
        });
        let key = sessionStorage.getItem('key') || "";
        let shared_secret = sessionStorage.getItem('shared_secret') || "";
        let cadena = "[{key:"+key+",X-Route:"+url+"}]";
        let hash = CryptoJS.HmacSHA256(cadena, shared_secret).toString(CryptoJS.enc.Hex);       

        headers = headers.set("X-Key",key);
        headers = headers.set("X-Route", "/"+url || "");
        headers = headers.set("X-Signature", hash || "");

        return headers;
    }
}
