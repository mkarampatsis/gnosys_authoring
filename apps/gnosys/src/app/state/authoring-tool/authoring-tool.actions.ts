import { createAction, props } from '@datorama/akita-ng-effects';

import { 
  Hint,
  Script,
  EduMaterial,
  Metadata,
  Tags
} from '@gnosys/interfaces';

// ******** Hint ******** // 
export const HintIsLoadingAction = createAction(
  'Set Hint Loading',
  props<{ isloading: boolean }>()
);

export const HintInitAction = createAction('Init Authoring Tool Hint');

export const HintCreateAction = createAction(
  'Create Hint',
   props<{ data: Hint }>()
);

export const HintUpdateAction = createAction(
  'Update Hint',
  props<{ data: Hint }>()
);

export const HintDeleteAction = createAction(
  'Delete Hint',
  props<{ data: string }>()
);

export const HintGetAllAction = createAction(
  'Get All Hints',
  props<{ email: string }>()
)

export const HintSetIDAction = createAction(
  'Set Active ID from Hint Store',
  props<{ setid: string }>()
)

// ******** Script ******** //
export const ScriptIsLoadingAction = createAction(
  'Set Script Loading',
  props<{ isloading: boolean }>()
);

export const ScriptInitAction = createAction('Init Authoring Tool Script');

export const ScriptCreateAction = createAction(
  'Create Script',
   props<{ data: Script }>()
);

export const ScriptUpdateAction = createAction(
  'Update Script',
  props<{ data: Script }>()
);

export const ScriptDeleteAction = createAction(
  'Delete Script',
  props<{ data: string }>()
);

export const ScriptGetAllAction = createAction(
  'Get All Scripts',
  props<{ email: string }>()
)

export const ScriptSetIDAction = createAction(
  'Set Active ID from Script Store',
  props<{ setid: string }>()
)

// ******** Educational Material ******** //
export const EduMaterialIsLoadingAction = createAction(
  'Set Educational Material Loading',
  props<{ isloading: boolean }>()
);

export const EduMaterialInitAction = createAction('Init Authoring Tool Educational Material');

export const EduMaterialCreateAction = createAction(
  'Create Educational Material',
   props<{ data: EduMaterial }>()
);

export const EduMaterialUpdateAction = createAction(
  'Update Educational Material',
  props<{ data: EduMaterial }>()
);

export const EduMaterialDeleteAction = createAction(
  'Delete Educational Material',
  props<{ data: string }>()
);

export const EduMaterialGetAllAction = createAction(
  'Get All Educational Materials',
  props<{ email: string }>()
)

export const EduMaterialSetIDAction = createAction(
  'Set Active ID from Educational Material Store',
  props<{ setid: string }>()
)

// ******** Metadata ******** //
export const MetadataIsLoadingAction = createAction(
  'Set Metadata Loading',
  props<{ isloading: boolean }>()
);

export const MetadataInitAction = createAction('Init Authoring Tool Metadata');

export const MetadataCreateAction = createAction(
  'Create Metadata',
   props<{ data: Metadata }>()
);

export const MetadataUpdateAction = createAction(
  'Update Metadata',
  props<{ data: Metadata }>()
);

export const MetadataDeleteAction = createAction(
  'Delete Metadata',
  props<{ data: string }>()
);

export const MetadataGetAllAction = createAction(
  'Get All Metadata',
  props<{ email: string }>()
)

export const MetadataSetIDAction = createAction(
  'Set Active ID from Metadata Store',
  props<{ setid: string }>()
)

// ******** Tags ******** //
export const TagsIsLoadingAction = createAction(
  'Set Tags Loading',
  props<{ isloading: boolean }>()
);

export const TagsInitAction = createAction('Init Authoring Tool Tags');

export const TagsCreateAction = createAction(
  'Create Tag',
   props<{ data: Tags }>()
);

export const TagsUpdateAction = createAction(
  'Update Tag',
  props<{ data: Tags }>()
);

export const TagsDeleteAction = createAction(
  'Delete Tag',
  props<{ data: string }>()
);

export const TagsGetAllAction = createAction(
  'Get All Tags',
  props<{ email: string }>()
)

export const TagsSetIDAction = createAction(
  'Set Active ID from Tags Store',
  props<{ setid: string }>()
)