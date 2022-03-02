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
  
  logout(){
    this.showMenu = false;
    this.tokenService.signOut();
    resetStores();
  }
}
