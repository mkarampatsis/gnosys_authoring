import { 
    Hint,
    Script,
    EduMaterial,
    Metadata,
    Tags
  } from '@gnosys/interfaces';

export const initHintFormData: Hint = {
  id: '',
  scriptid:'',
  scriptname:'',
  email:'',
  title: '',
  description: '',
  code: '',
  loading: false,
};

export const initScriptFormData: Script = {
  id: '',
  email:'',
  name: '',
  description:'',
  code: [],
  language: '',
  loading: false,
}

export const initEduMaterialFormData: EduMaterial = {
  id: '',
  scriptid: '',
  scriptname: '',
  email:'',
  about: '',
  file: '',
  video: '',
  loading: false,
}

export const initMetadataFormData: Metadata = {
  id: '',
  scriptid: '',
  scriptname: '',
  email: '',
  linesofcode: '',
  timetosolve: '',
  numofif: '',
  numoffor: '',
  tags: [],
  loading: false,
}

export const initTagsFormData: Tags = {
  id: '',
  language: '',
  tag: '',
  loading: false,
}