export const KubernetesUserTokensFormComponent = {
  bindings: {
    transition: '<'
  },
  template: require('./kubernetes-user-tokens-form.html'),
  controller: KubernetesUserTokensFormController
};

function KubernetesUserTokensFormController($state, hubApiService, logger, _, KubernetesClusters) {
  'ngInject';

  const ctrl = this;

  const userId = ctrl.transition && ctrl.transition.params().userId;
  const tokenId = ctrl.transition && ctrl.transition.params().tokenId;

  ctrl.KubernetesClusters = KubernetesClusters;
  ctrl.loading = true;
  ctrl.saving = false;
  ctrl.isNew = true;
  ctrl.tokenData = null;
  ctrl.assignedKubernetesClusters = null;
  ctrl.searchText = '';
  ctrl.user = null;

  ctrl.loadTokenData = loadTokenData;
  ctrl.searchUsers = searchUsers;
  ctrl.createOrUpdate = createOrUpdate;

  init();

  function init() {
    ctrl.isNew = !tokenId;
    ctrl.loading = true;

    // Kubernetes clusters are defined as follows:
    // [
    //   {name: 'cluster1', description: 'Cluster 1'},
    //   {name: 'cluster2', description: 'Cluster 2'},
    //   ...
    // ];
    KubernetesClusters
      .refresh()
      .then(() => {
        if (userId) {
          return loadUserAndToken();
        }
      })
      .finally(() => {
        ctrl.loading = false;
      });
  }

  function loadUserAndToken() {
    return hubApiService
      .getUser(userId)
      .then(user => {
        ctrl.user = user;
        return loadTokenData();
      });
  }

  function loadTokenData() {
    if (ctrl.user) {
      return hubApiService
        .getUserIdentities(ctrl.user.id)
        .then(identities => {
          const identity = _.find(identities, ['provider', 'kubernetes']);

          if (identity) {
            ctrl.tokenData = _.find(identity.kubernetes_tokens, ['id', tokenId]);
            ctrl.assignedKubernetesClusters = _.map(identity.kubernetes_tokens, 'cluster.name');
          } else {
            ctrl.tokenData = {};
            ctrl.assignedKubernetesClusters = [];
          }
        });
    }
  }

  function searchUsers(query) {
    return hubApiService.searchUsers(query, true);
  }

  function createOrUpdate() {
    if (ctrl.kubernetesTokenForm.$invalid) {
      logger.error('Check the form for issues before saving');
      return;
    }

    ctrl.saving = true;

    if (ctrl.isNew) {
      hubApiService
        .createKubernetesToken(ctrl.user.id, ctrl.tokenData)
        .then(() => {
          logger.success('New kubernetes token created');
          $state.go('kubernetes.user-tokens.list', {userId: ctrl.user.id});
        })
        .finally(() => {
          ctrl.saving = false;
        });
    } else {
      hubApiService
        .updateKubernetesToken(tokenId, ctrl.tokenData)
        .then(() => {
          logger.success('Kubernetes token updated');
          $state.go('kubernetes.user-tokens.list', {userId: ctrl.user.id});
        })
        .finally(() => {
          ctrl.saving = false;
        });
    }
  }
}
