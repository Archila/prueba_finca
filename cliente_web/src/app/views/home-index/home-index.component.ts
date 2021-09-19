import { Component, OnInit } from '@angular/core';

import { MessagesService } from '../../../services/messages/messages.service';
import { CredentialsService } from '../../../services/credentials/credentials.service';

@Component({
  selector: 'app-home-index',
  templateUrl: './home-index.component.html',
  styleUrls: ['./home-index.component.css']
})
export class HomeIndexComponent implements OnInit {

  key= "";
  shared_secret = "";
  state=0; 
  msg = "";
  data:{id:Int16Array, msg:string, tags:string}[]=[];
  dataById = {id:0, msg:"",tags:""};
  dataByTags:{id:Int16Array, msg:string, tags:string}[]=[];

  constructor(private messagesService : MessagesService, private credentialService : CredentialsService) { }

  ngOnInit(): void {
  }

  credentials() {    
    this.credentialService.addCredential({"key":this.key, "shared_secret":this.shared_secret}).subscribe(
      (response:any) => {
        if(response == null){
          this.state = 204;
          this.msg = "Key added succesfuly";
          sessionStorage.setItem('key', this.key );
          sessionStorage.setItem('shared_secret', this.shared_secret);
        } 
      },
      (err) => {
        this.state = err.status;
        this.msg = err.error.msg;
      }
    )
  }
}
