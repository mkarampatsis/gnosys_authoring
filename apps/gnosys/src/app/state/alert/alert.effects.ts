import { Injectable } from '@angular/core';
import {
  Actions as AkitaActions,
  createEffect,
  ofType,
} from '@datorama/akita-ng-effects';
import { tap } from 'rxjs/operators';
import { AlertService } from './alert.service';
import * as Actions from './alert.actions';
import { AlertType } from './alert.model';

import { 
  AlertResetAction
} from '..';

@Injectable()
export class AlertEffects {
  constructor(
    private actions: AkitaActions,
    private alertService: AlertService
  ) {}

  AlertSuccessEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.AlertSuccessAction),
      tap((payload) => {
        this.actions.dispatch(
          AlertResetAction
        );
        this.alertService.add(
          payload.message,
          AlertType.Success,
          payload.header,
          payload.options
        );
      })
    )
  );

  AlertErrorEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.AlertErrorAction),
      tap((payload) => {
        this.actions.dispatch(
          AlertResetAction
        );
        this.alertService.add(
          payload.message,
          AlertType.Error,
          payload.header,
          payload.options
        );
      })
    )
  );

  AlertInfoEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.AlertInfoAction),
      tap((payload) => {
        this.actions.dispatch(
          AlertResetAction
        );
        this.alertService.add(
          payload.message,
          AlertType.Info,
          payload.header,
          payload.options
        );
      })
    )
  );

  AlertWarnEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.AlertWarnAction),
      tap((payload) => {
        this.actions.dispatch(
          AlertResetAction
        );
        this.alertService.add(
          payload.message,
          AlertType.Warning,
          payload.header,
          payload.options
        );
      })
    )
  );

  AlertDismissEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.AlertDismissAction),
      tap((payload) => {
        this.actions.dispatch(
          AlertResetAction
        );
        this.alertService.remove(payload.id);
      })
    )
  );

  AlertResetEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.AlertResetAction),
      tap(() => {
        this.alertService.resetAlert();
      })
    )
  );
}
