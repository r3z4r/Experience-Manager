#!/bin/sh
## rancher2-upgrade.sh
## maintainer: DL-PE-CICD@tecnotree.com
## PUSH deployment, upgrade docker image of container in a POD in a Rancher manageed Kubernetes cluster
##   note! PUSH model require to store the cluster environment auth credentials (API token) centrally such as in Jenkins Server
##         ** GitOps 'PULL' model is the recommended strategy for Continous Deployment
##g
## usage: ./rancher2-upgrade.sh <build-profile> <image:tag> <rancher-api-key-token-A> <rancher-api-key-token-B> ...<more tokens..>
##        where; image build-profile is derived from the branch that triggered build, alpha|beta|rc as per semver2
## example: ./rancher2-upgrade.sh beta dev-docker-registry.tecnotree.com/dpay/dpay-service:5.2.1-rc-2-g3d2d558 token-cyyy:pyyyyy token-czzz:pzzzzz

# customizable config properties
export CONTAINER="moments-experience-manager"   # container name set from helm chart

# non-customizable config propeties set from jenkins pipeline
export BUILD_PROFILE=${1}
export BUILD_IMAGE=${2}
export RANCHER_GLOBAL_USER_API_TOKEN_DEV_RANCHER=${3}
export RANCHER_GLOBAL_USER_API_TOKEN_RANCHER2=${4}
export RANCHER_GLOBAL_USER_API_TOKEN_RANCHER3=${5}

#####
# use rancher api to access cluster context, run kubectl set container image
setImage() {
  local RANCHER_SERVER_URI="$1"
  local RANCHER_PROJECT_ID="$2"
  local NAMESPACE="$3"
  local DEPLOYMENT="$4"

  unset RANCHER_API_KEY_TOKEN

  if [ "$RANCHER_SERVER_URI" = "https://dev-rancher.tecnotree.com/v3" ]; then
     RANCHER_API_KEY_TOKEN=${RANCHER_GLOBAL_USER_API_TOKEN_DEV_RANCHER}
  elif [ "$RANCHER_SERVER_URI" = "https://rancher2.tecnotree.com/v3" ]; then
     RANCHER_API_KEY_TOKEN=${RANCHER_GLOBAL_USER_API_TOKEN_RANCHER2}
  elif [ "$RANCHER_SERVER_URI" = "https://bdc-rancher.tecnotree.com/v3" ]; then
	RANCHER_API_KEY_TOKEN=${RANCHER_GLOBAL_USER_API_TOKEN_RANCHER3}
  else
     echo "FAILED: unknown Rancher Server API ${RANCHER_SERVER_URI}"
     return 1
  fi

  ./rancher login --token ${RANCHER_API_KEY_TOKEN} --context ${RANCHER_PROJECT_ID} ${RANCHER_SERVER_URI}
  if [ $? != 0 ]; then
     echo "FAILED: cannot access Rancher API ${RANCHER_SERVER_URI} context ${RANCHER_PROJECT_ID}"
     return 1
  else
     ./rancher kubectl set image deployment/${DEPLOYMENT} ${CONTAINER}=${BUILD_IMAGE} --namespace=${NAMESPACE}
     if [ $? != 0 ]; then
          echo "FAILED: cannot update image for deployment/${DEPLOYMENT} ${CONTAINER}=${BUILD_IMAGE} --namespace=${NAMESPACE}"
          return 1
     else
          ./rancher kubectl set env deployment/${DEPLOYMENT} --namespace=${NAMESPACE} --from=configmap/moments-campaign-management-ui-config
          echo "SUCCESS: image updated for deployment/${DEPLOYMENT} ${CONTAINER}=${BUILD_IMAGE} --namespace=${NAMESPACE}"
          return 0
     fi
  fi
   unset RANCHER_SERVER_URI
   unset RANCHER_PROJECT_ID
   unset NAMESPACE
   unset DEPLOYMENT
}

#####
# main
if [ $# -le 3 ] ; then
     echo "must provide arguments: <BUILD_PROFILE> <BUILD_IMAGE> <USER_TOKEN_DEVRANCHER> <USER_TOKEN_RANCHER2>"
     exit 1
fi

# install kubectl if none in path
KUBECTL_BIN=$(which kubectl)
if [ -z "${KUBECTL_BIN}" ]; then
     wget https://nexus.tecnotree.com/repository/raw-3rd-party/kubernetes-release/kubectl/v1.15.0/kubernetes-release-amd64-v1.15.0.tar.gz -O - | tar -zx  -C . && \
     chmod +x ./kubectl && \
     PATH=$PATH:.
fi
# install rancher cli if none in path
RANCHER_BIN=$(which rancher)
if [ -z "${RANCHER_BIN}" ]; then
     wget https://nexus.tecnotree.com/repository/raw-3rd-party/rancher/cli/v2.2.0/rancher-linux-amd64-v2.2.0.tar.gz -O - | tar -zx  -C . --strip-components=2 && \
     chmod +x ./rancher && \
     PATH=$PATH:.
fi

case $BUILD_PROFILE in
     "alpha")
          setImage https://bdc-rancher.tecnotree.com/v3 c-wsthv:p-gcs89 moments-dev-ns moments-experience-manager
          ;;
     "beta")
          setImage https://bdc-rancher.tecnotree.com/v3 c-wsthv:p-h7nsj moments-fit moments-experience-manager
          ;;
     "rc")

          ;;
	*)
     echo "ABORTED: skip updating image for unknown release profile: $BUILD_PROFILE"
     exit 1
    	;;
esac

exit 0
