import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {PreferencesComponent} from './preferences/preferences.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {PlayComponent} from './play/play.component';
import {RecordsComponent} from './records/records.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'play', component: PlayComponent },
  { path: 'records', component: RecordsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }
];
