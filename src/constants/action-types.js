/**
 * Authentication
 */
export const GET_IDENTITY = 'GET_IDENTITY';
export const SET_IDENTITY = 'SET_IDENTITY';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const GET_USER_WEBSCENES = 'GET_USER_WEBSCENES';
export const SET_USER_WEBSCENES = 'SET_USER_WEBSCENES';

/**
 * Map & View
 */
export const INIT_MAP = 'INIT_MAP';
export const SWITCH_MAP = 'SWITCH_MAP';
export const INIT_SPLITMAP = 'INIT_SPLITMAP';

export const MAP_ACTION_CLEAR_GRAPHICS = 'map-action-clear-graphics';

export const ACTION_MEASURE_2D_LINE = 'action-measure-2d-line'; // 二维测距离
export const ACTION_MEASURE_2D_AREA = 'action-measure-2d-area'; // 二维测面积
export const ACTION_PRINT_2D_MAP = 'action-print-2d-map';
export const MAP_ACTION_CLIP_MAP = 'map-action-clip-map';


export const ACTION_MAP_2D_CORRECT = 'action-map-2d-correct';

export const VIEW_MODE_2D = 'view-mode-2d';
export const VIEW_MODE_3D = 'view-mode-3d';

/**
 * Selection
 */
export const SELECTION_SET = 'SELECTION_SET';
export const SELECTION_ADD = 'SELECTION_ADD';
export const SELECTION_REMOVE = 'SELECTION_REMOVE';
export const SELECTION_RESET = 'SELECTION_RESET';

/**
 * Environment
 */
export const SET_ENVIRONMENT = 'SET_ENVIRONMENT';
export const SET_DATE = 'SET_DATE';
export const SET_SHADOWS = 'SET_SHADOWS';

/**
 * draw
 */
export const ACTION_DRAW_POINT_2D = 'action-draw-point-2d';
export const ACTION_DRAW_LINE_2D = 'action-draw-line-2d';
export const ACTION_DRAW_FLAT_2D = 'action-draw-flat-2d';

/**
 * bookmark
 */
export const ACTION_ADDBOOKMARK_2D = 'action-addbookmark-2d';
export const ACTION_GOTOBOOKMARK_2D = 'action-gotobookmark-2d';
export const ACTION_DELETBOOKMARK_2D = 'action-deletbookmark-2d';
export const ACTION_DELETTHISBOOKMARK_2D = 'action-deletthisbookmark-2d';
export const ACTION_EDITBOOKMARK_2D = 'action-editbookmark-2d';

/**
 * mapcorrect
 */
export const ACTION_ADDMAPCORRECT_2D = 'action-addmapcorrect-2d';

/**
 * toolbar
 */
export const ACTION_MEASURE_LINE_3D = 'action-measure-line-3d';
export const ACTION_MEASURE_AREA_3D = 'action-measure-area-3d';
export const ACTION_MAP_PAN = 'action-map-pan';
export const ACTION_MAP_ROTATE = 'action-map-rotate';
export const ACTION_MAP_OVERVIEW = 'action-map-overview';
export const ACTION_MAP_EYEVIEW = 'action-map-eyeview';
export const ACTION_MAP_ROAM = 'action-map-roam';
export const ACTION_MAP_PRINT_3D = 'action-map-print-3d';


/**
 * layerlist
 */
export const LAYERLIST_WEBMAP_CHANGE = 'layerlist-webmap-change';
export const LAYERLIST_WEBMAP_LIST = 'layerlist-webmap-list';
export const SUBJECTLAYERLIST_ADD_OR_REMOVE = 'subjectlayer-add-or-remove';
export const SUBJECTLAYERLIST_SAVE = 'subjectlayer-save';
export const LAYERLIST_GET_TREE = 'layerlist-get-tree';
export const LAYERLIST_ADD_LAYERS = 'layerlist-add-layers';
export const LAYERLIST_REMOVE_LAYERS = 'layerlist-remove-layers';
export const LAYERLIST_CHANGE_INDEX = 'layerlist-change-index';
export const LAYERLIST_POLT_BYTYPE = 'layerlist-polt-bytype';
export const LAYERLIST_POLT_LAYER_SAVE = 'layerlist-polt-layer-save';
export const LAYERLIST_SUBJECT_SWITCH = 'layerlist-subject-switch';
export const LAYERLIST_RELOAD_WEATHER_LAYERS = 'layerlist-reload-weather-layers';
export const LAYERLIST_TOP_COLLECTION = 'layerlist-top-collection';
export const LAYERLIST_SUBJECT_REMOVE = 'layerlist-subject-remove';

/**
 * polt
 */
export const POLT_CLEAR_LAYER = 'polt-clear-layer';
export const POLT_CANCLE_LASTONE = 'polt-canel-lastone';
export const POLT_EDIT_UPDATE = 'polt-edit-update';
export const POLT_EDIT_DELETE = 'polt-edit-delete';
export const POLT_EDIT_UNDO = 'polt-edit-undo';
export const POLT_EDIT_REDO = 'polt-edit-redo';
export const POLT_EDIT_CLEAR = 'polt-edit-clear';
export const POLT_SHOWLAYER_BYITEMID = 'polt-showlayer-byitemid';
export const POLT_EDIT_ACTIVE = 'polt-edit-active';
export const POLT_EDIT_SAVE = 'polt-edit-save';
export const POLT_EDIT_CANCEL = 'polt-edit-cancel';
export const POLT_EDIT_COMPLETE = 'polt-edit-complete';
export const POLT_EDIT_DEACTIVE = 'polt-edit-deactive';

export const POLT_EDITOR_REMOVE = 'polt-editor-remove';
export const POLT_EDITOR_CREATE = 'polt-editor-create';

export const POLT_EDIT_ACTIVE_COLLECTION = 'polt-edit-active-collection';
export const POLT_EDIT_SAVE_COLLECTIN = 'polt-edit-save-collection';
export const POLT_DOWNLOAD_FILE_BYTYPE = 'polt-download-file-bytype';
export const POLT_DOWNLOAD_COLLECTION_BYTYPE = 'polt-download-collection-bytype';
export const POLT_REMOVElAYER_BY_ITEMID = 'polt-removelayer-by-itemid';
export const POLT_ADDPOLTFILE_LAYERITEM = 'polt-polt-addpoltfile-layeritem';