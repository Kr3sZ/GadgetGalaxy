import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
