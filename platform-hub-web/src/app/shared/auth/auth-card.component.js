export const AuthCardComponent = {
  template: require('./auth-card.html'),
  controller: AuthCardController
};

function AuthCardController($scope, $state, authService, events) {
  'ngInject';

  const ctrl = this;

  ctrl.isAuthenticated = false;
  ctrl.authData = {};

  ctrl.login = login;
  ctrl.logout = logout;

  init();

  function init() {
    ctrl.isAuthenticated = authService.isAuthenticated();
    ctrl.authData = authService.getPayload();

    // Listen for further changes
    $scope.$on(events.auth.updated, (event, authData) => {
      ctrl.isAuthenticated = Boolean(authData);
      ctrl.authData = authData;
    });
  }

  function login() {
    authService.authenticate();
  }

  function logout() {
    authService
      .logout()
      .then(() => {
        $state.go('home');
      });
  }
}