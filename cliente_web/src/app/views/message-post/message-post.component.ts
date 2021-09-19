import { Component, OnInit } from '@angular/core';


import { MessagesService } from '../../../services/messages/messages.service';
import { CredentialsService } from '../../../services/credentials/credentials.service';

@Component({
  selector: 'app-message-post',
  templateUrl: './message-post.component.html',
  styleUrls: ['./message-post.component.css']
})
export class MessagePostComponent implements OnInit {

  id= "";
  tags_search = "";
  msg ="";
  tags = "";
  data:{id:Int16Array, msg:string, tags:string}[]=[];
  dataById = {id:0, msg:"",tags:""};
  dataByTags:{id:Int16Array, msg:string, tags:string}[]=[];

  err_403 = false;

  constructor(private messagesService : MessagesService, private credentialService : CredentialsService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {    
    this.messagesService.getMessages().subscribe(
      (response:any) => {
        this.data = response.body;
      }
    )
  }

  searchById(){
    this.messagesService.getMessage(this.id,{}).subscribe(
      (response:any) => {        
        if(response.status == 200){
          this.dataById = response.body;
        } else {
          this.dataById = {id:0, msg:"",tags:""};
        }
      },
      (err) => {
        if(err.status == 403){
          this.err_403=true;
        }
      }
    )
  }

  searchByTags() {    
    this.messagesService.getMessagesTags(this.tags_search,{}).subscribe(
      (response:any) => {
        if(response.status == 200){
          this.dataByTags = response.body;
        } else {
          this.dataByTags = [];
        }
      },
      (err) => {
        if(err.status == 403){
          this.err_403=true;
        }
      }
    )
  }

  addMessage(){
    this.messagesService.addMessage({"msg":this.msg, "tags":this.tags}).subscribe(
      (response:any) => {
        if(response.body.id){
          this.msg = "";
          this.tags = "";
          this.loadMessages();
        } 
      },
      (err) => {
        if(err.status == 403){
          this.err_403=true;
        }
      }
    )
  }

}