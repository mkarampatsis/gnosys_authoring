import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UserQuery } from './state';
import { TokenService } from './services/token.service';

import { akitaConfig } from '@datorama/akita';
import { resetStores } from "@datorama/akita";

akitaConfig({ resettable: true });

@Component({
  selector: 'gnosys-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  loading$ = this.userQuery.loading$;
  showMenu = false;
  mainTitle = "Code4Code";

  constructor(
    private userQuery: UserQuery,
    private tokenService: TokenService  
  ) {}

  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }
  
  signOut(){
    this.showMenu = false;
    this.tokenService.signOut();
    localStorage.removeItem('AkitaStores');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-refreshtoken');
    localStorage.removeItem('auth-user');
    resetStores();
  }
}
