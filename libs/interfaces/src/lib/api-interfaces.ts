import { EmailValidator } from '@angular/forms';
import { FormControl } from '@ngneat/reactive-forms';

export interface Message {
  message: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  accessToken: string;
  refreshToken: string;
  verification: string;
  loading: boolean;
  roles?: [string];
}

export interface ForgotPassword {
  email: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordData {
  email: string;
  password: string;
}

export interface Generic {
  [key: string]: FormControl<string>;
}

export interface Controls {
  name: string;
  value: FormControl<string>;
}

export interface Hint {
  id: string;
  scriptid:string;
  scriptname:string
  email:string;
  title: string;
  description: string;
  code: string;
  loading: boolean;
}

export interface Script {
  id: string;
  email:string;
  name: string;
  description: string;
  code: Array<string>;
  language: string;
  loading: boolean;
}

export interface EduMaterial {
  id: string;
  scriptid: string;
  scriptname: string;
  email:string;
  about: string;
  file: string;
  video: string;
  loading: boolean;
}

export interface Metadata {
  id: string;
  scriptid: string;
  scriptname: string;
  email:string;
  linesofcode: string;
  timetosolve: string;
  numofif: string;
  numoffor: string;
  tags: string[];
  loading: boolean;
}

export interface Tags {
  id: string;
  language: string;
  tag: string;
  loading: boolean;
}