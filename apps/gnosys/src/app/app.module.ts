import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { UiModule } from '@gnosys/ui';
import { DialogModule } from '@ngneat/dialog';
import { SvgIconsModule } from '@ngneat/svg-icon';
// import { questionMarkCircleIcon } from '@gnosys/svg/code4code/question-mark-circle';

import { AppComponent } from './app.component';

import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { environment } from '../environments/environment';

import { GnosysUserEffects, AlertEffects, GnosysRouterEffects, GnosysAuthoringToolEffects } from './state';

import { authInterceptorProviders } from './services';
//import { AlertsComponent } from './components/alerts/alerts.component';

@NgModule({
  // declarations: [AppComponent, AlertsComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () =>
            import('./landing.module/landing.module').then(
              (m) => m.LandingModule
            ),
        },
        {
          path: 'user',
          loadChildren: () =>
            import('./user.module/user.module').then((m) => m.UserModule),
        },
        {
          path: 'authoring',
          loadChildren: () =>
            import('./authoring-tool.module/authoring-tool.module').then(
              (m) => m.AuthoringToolModule),
        },
      ],
      { useHash: true }
    ),
    HttpClientModule,
    ReactiveFormsModule,
    UiModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule,
    AkitaNgEffectsModule.forRoot([
      GnosysUserEffects,
      AlertEffects,
      GnosysRouterEffects,
      GnosysAuthoringToolEffects
    ]),
    SvgIconsModule.forRoot({
      sizes: {
        xs: '10px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '24px',
        xxl: '30px',
      },
      defaultSize: 'xl',
      // missingIconFallback: questionMarkCircleIcon,
    }),
    DialogModule.forRoot({
      sizes: {
        sm: {
          width: 400, // 300px
          minHeight: 200, // 250px
        },
        md: {
          width: '60vw',
          height: '60vh',
        },
        lg: {
          width: '90vw',
          height: '90vh',
        },
        fullScreen: {
          width: '100vw',
          height: '100vh',
        },
        stretch: {
          minHeight: 500,
          maxHeight: '85%',
        },
      },
    }),
  ],
  providers: [
    {
      provide: NG_ENTITY_SERVICE_CONFIG,
      useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' },
    },
    authInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
