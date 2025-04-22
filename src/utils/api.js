// @project

export function logout() {
  localStorage.removeItem(serviceToken);
  localStorage.removeItem(user);
  window.location.pathname = '/login';
}
