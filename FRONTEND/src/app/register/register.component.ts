import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

}
