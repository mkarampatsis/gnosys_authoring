import Document from 'mongoose';

export interface Hint extends Document {
  scriptid:string;
  scriptname:string;
  email: string;
  title: string;
  description: string;
  code: string;
}

export interface Script extends Document {
  email: string;
  name: string;
  description: string;
  code: Array<string>;
  language: string;
}

export interface EduMaterial extends Document {
  scriptid:string;
  scriptname:string;
  email:string;
  about: string;
  file: string;
  video: string;
  loading: boolean;
}

export interface Metadata extends Document {
  scriptid:string;
  scriptname:string;
  email:string;
  linesofcode: string;
  timetosolve: string;
  numofif: string;
  numoffor: string;
  tags: Array<{ id: string, name: string }>;
  loading: boolean;
}

export interface Tags extends Document {
  email:string;
  language:string;
  tag:string;
}