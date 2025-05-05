export const DASHBOARD_PATH = '/dashboard';
export const HORIZONTAL_MAX_ITEM = 7;
export const DIALOG_TITLE_PADDING = { px: 2, py: 1 };
export const DIALOG_CONTENT_PADDING = { px: 2, py: 3 };

export let MenuOrientation;

(function (MenuOrientation) {
  MenuOrientation['VERTICAL'] = 'vertical';
  MenuOrientation['HORIZONTAL'] = 'horizontal';
})(MenuOrientation || (MenuOrientation = {}));

export let ThemeMode;

(function (ThemeMode) {
  ThemeMode['LIGHT'] = 'light';
  ThemeMode['DARK'] = 'dark';
})(ThemeMode || (ThemeMode = {}));

export let ThemeDirection;

(function (ThemeDirection) {
  ThemeDirection['LTR'] = 'ltr';
  ThemeDirection['RTL'] = 'rtl';
})(ThemeDirection || (ThemeDirection = {}));

export let AuthProvider;

(function (AuthProvider) {
  AuthProvider['JWT'] = 'jwt';
  AuthProvider['FIREBASE'] = 'firebase';
  AuthProvider['AUTH0'] = 'auth0';
  AuthProvider['AWS'] = 'aws';
  AuthProvider['SUPABASE'] = 'supabase';
})(AuthProvider || (AuthProvider = {}));

export let DropzopType;

(function (DropzopType) {
  DropzopType['default'] = 'DEFAULT';
  DropzopType['standard'] = 'STANDARD';
})(DropzopType || (DropzopType = {}));

export const APP_AUTH = AuthProvider.JWT;

const config = {
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 8,
  outlinedFilled: true,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
  i18n: 'en',
  themeDirection: ThemeDirection.LTR,
  container: true
};

export default config;
