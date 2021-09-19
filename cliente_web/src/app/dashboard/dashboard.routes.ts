import { Routes } from '@angular/router';
import { HomeIndexComponent } from '../views/home-index/home-index.component';
import { MessagePostComponent } from '../views/message-post/message-post.component';


export const dashboardRoutes: Routes = [

    { path: 'home', component: HomeIndexComponent },
    { path: 'message', component: MessagePostComponent },
    

];