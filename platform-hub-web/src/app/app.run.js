export const appRun = function ($q, $rootScope, $transitions, $state, authService, loginDialogService, roleCheckerService, events, apiPagination, AppSettings, Me, FeatureFlags, logger, _) {
  'ngInject';

  logger.debug('Starting app…');

  // Inject lodash into templates that have rootScope access.
  $rootScope._ = _;

  refreshAppSettings();

  // Fetch feature flags now if user is logged in (otherwise they will be
  // fetched later when user does log in).
  if (authService.isAuthenticated()) {
    FeatureFlags.refresh();
  }

  function refreshAppSettings() {
    // Fetch public AppSettings and inject into templates that have rootScope access.
    return AppSettings
      .refresh()
      .then(() => {
        $rootScope.AppSettings = AppSettings;
      });
  }

  // Listen for auth data change and react accordingly.
  const authDataHandler = $rootScope.$on(events.auth.updated, () => {
    Me.clear();

    if (authService.isAuthenticated()) {
      refreshAppSettings();
      Me.refresh();
      FeatureFlags.refresh();
    }
  });

  // Listen for API resource not found event
  const apiResourceNotFoundHandler = $rootScope.$on(events.api.resourceNotFound, () => {
    logger.error('Not found');
    $state.go('home');
  });

  // Listen for auth unauthorized event
  const authUnauthorizedHandler = $rootScope.$on(events.auth.unauthorized, () => {
    logger.error('User unauthorized.');
    $state.go('home');
  });

  // Listen for auth forbidden event
  const authForbiddenHandler = $rootScope.$on(events.auth.forbidden, () => {
    logger.error('Access forbidden.');
    $state.go('home');
  });

  // Listen for auth deactivated event
  const authDeactivatedHandler = $rootScope.$on(events.auth.deactivated, () => {
    logger.error('Contact an admin to properly activate your account on the hub');
    authService
      .logout()
      .then(() => {
        $state.go('home');
      });
  });

  $rootScope.$on('$destroy', apiResourceNotFoundHandler);
  $rootScope.$on('$destroy', authDataHandler);
  $rootScope.$on('$destroy', authUnauthorizedHandler);
  $rootScope.$on('$destroy', authForbiddenHandler);
  $rootScope.$on('$destroy', authDeactivatedHandler);

  // ---------------------------------------------------------------------------
  // Handle transitions to states – this takes into account authentication,
  // feature flags and role checks.
  //
  // See the app.routes.spec.js file for the expected rules.

  function onFail() {
    return $state.target('home');
  }

  function reject() {
    return $q.reject();
  }

  function authenticationChecker() {
    if (authService.isAuthenticated()) {
      return $q.resolve(true);
    }

    return loginDialogService
      .run()
      .catch(reject);
  }

  function featureFlagsChecker(flags) {
    return FeatureFlags
      .refresh()
      .then(() => {
        if (FeatureFlags.allEnabled(flags)) {
          return $q.resolve(true);
        }
        return reject();
      })
      .catch(reject);
  }

  function roleChecker(roles) {
    return roleCheckerService
      .hasHubRole(roles)
      .then(hasRole => {
        if (hasRole) {
          return $q.resolve(true);
        }
        return reject();
      })
      .catch(reject);
  }

  function handlePerPageParam(params) {
    if (_.has(params, 'per_page')) {
      apiPagination.setPerPage(parseInt(params.per_page, 10));
    } else {
      apiPagination.resetPerPage();
    }
  }

  $transitions.onStart({}, transition => {
    handlePerPageParam(transition.params());

    const config = transition.$to().data;

    const shouldAuthenticate = Boolean(config.authenticate);

    const shouldCheckFeatureFlags = _.has(config, 'featureFlags');
    const featureFlags = config.featureFlags;

    const shouldCheckRole = _.has(config, 'rolesPermitted');
    const rolesPermitted = config.rolesPermitted;

    // Assumption: if the route doesn't need authentication, then no other
    // config option is supported and checked.

    if (shouldAuthenticate) {
      return authenticationChecker()
        .then(() => {
          if (shouldCheckFeatureFlags) {
            return featureFlagsChecker(featureFlags);
          }
          return true;
        })
        .then(() => {
          if (shouldCheckRole) {
            return roleChecker(rolesPermitted);
          }
          return true;
        })
        .catch(onFail);
    }
  });
};
