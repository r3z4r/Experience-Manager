@Library('cicd') _
def IMAGE_NAME = "experience-manager"
def REPO_STAGING = "anchore"
def REPO_DEVELOP = "moments"
def REPO_DELIVER = "moments"
def REGISTRY_DEVELOP = "dev-docker-registry.tecnotree.com"
def REGISTRY_DELIVER = "registry.tecnotree.com"
def REGISTRY_LOGIN = "dev-docker-registry-login"
def BRANCH_ALPHA = "develop"
def BRANCH_BETA = "release"
def BRANCH_RC = "main"
def executeBIQstages = true
def enableSQgate  = true
def abortPipelineSQgate  = true
def anchoreBAILgate = false

// DO NOT MODIFY pipeline below except for the stage 'Build Code' script
def IMAGE_TAG
def IMAGE_OPTIONS
def IMAGE_STAGING
def IMAGE_DEVELOP
def IMAGE_DELIVER

pipeline {
	agent {
		label 'nodejs-18-node'
	}
	options {
		timeout(time: 1, unit: 'HOURS')
	}
	stages {
		stage('Init') {
			steps {
				script {
					echo "initialize build package traceabilty properties"
					IMAGE_TAG = cicd.getImageTag()
					IMAGE_OPTIONS = '--build-arg RELEASE=' + IMAGE_TAG + ' --label release-version=' + IMAGE_TAG + ' --label branch-name=' + GIT_LOCAL_BRANCH + ' --label vendor="Tecnotree" .'
					IMAGE_STAGING = "${REPO_STAGING}/${IMAGE_NAME}:${IMAGE_TAG}"
					IMAGE_DEVELOP = "${REPO_DEVELOP}/${IMAGE_NAME}:${IMAGE_TAG}"
					IMAGE_DELIVER = "${REPO_DELIVER}/${IMAGE_NAME}:${IMAGE_TAG}"
				}
			}
		}
		stage('Build Code') {
			steps {
			    script{
					sh 'npm cache clean --force'
				    cicd.build('node', 'moments', 'install --legacy-peer-deps')
					cicd.build('node', 'moments', 'run build')
				}
			}
		}
		stage('Sonar Project') {
			when {
				anyOf {
					branch BRANCH_RC;
					tag pattern: "^\\d.\\d.\\d(-rc.\\d+)?", comparator: "REGEXP";
				}
			}
			steps {
                script{
				    cicd.setSonarPropsFile()
			    }
		    }
	    }
		stage('Sonar CodeScan') {
			when { expression { executeBIQstages == true } }
			environment {
				scannerHome = tool 'Sonar-scanner'
			}
			steps {
				echo "Sonarqube code analysis"
				withSonarQubeEnv('sonarqube.tecnotree.com') {
					sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectVersion='${env.BRANCH_NAME}-${IMAGE_TAG}'"
				}
			}
		}
		stage('Sonar CodeQualityGate') {
			  when { expression { executeBIQstages == true && enableSQgate == true } }
			  steps {
				echo "verify code analysis on quality gate"
				timeout(time: 10, unit: 'MINUTES') {
					waitForQualityGate abortPipeline: abortPipelineSQgate
				}
			}
		}
		stage('Build DockerImage') {
			/*when {
			    anyOf { branch BRANCH_RC; branch BRANCH_BETA; branch BRANCH_ALPHA;
						tag pattern: "^\\d.\\d.\\d(-rc.\\d+)?", comparator: "REGEXP";
						tag pattern: "^\\d.\\d.\\d(-beta.\\d+)?", comparator: "REGEXP"
				}
			}*/
			steps {
				script {
				    cicd.docker_build("https://${REGISTRY_DEVELOP}", "${IMAGE_STAGING}", IMAGE_OPTIONS)
					}
				}
			}
		stage('Anchore ScanImage') {
			when {
				expression { executeBIQstages == true }
				anyOf { branch BRANCH_RC;
					    tag pattern: "^\\d.\\d.\\d(-rc.\\d+)?", comparator: "REGEXP";
				}
			}
			steps {
				script {
				   cicd.anchore_scan("${REGISTRY_DEVELOP}/${IMAGE_STAGING}", anchoreBAILgate)
				}
			}
		}
		stage('Publish Image') {
			/*when {
				anyOf {	branch BRANCH_RC; branch BRANCH_BETA; branch BRANCH_ALPHA;
						tag pattern: "^\\d.\\d.\\d(-rc.\\d+)?", comparator: "REGEXP";
						tag pattern: "^\\d.\\d.\\d(-beta.\\d+)?", comparator: "REGEXP"
				}
			}*/
			parallel {
				stage('to DevelopRegistry') {
					steps {
						script {
						    cicd.publish_image(REGISTRY_DEVELOP, IMAGE_STAGING, REGISTRY_DEVELOP, IMAGE_DEVELOP, 'development')
							}
						}
					}

				stage('to DeliveryRegistry') {
					when { 
						anyOf {tag pattern: "^\\d.\\d.\\d(-rc.\\d+)?", comparator: "REGEXP";
							tag pattern: "^\\d.\\d.\\d(-beta.\\d+)?", comparator: "REGEXP" }
					}
					steps {
						script {
						    cicd.publish_image(REGISTRY_DEVELOP, IMAGE_STAGING, REGISTRY_DELIVER, IMAGE_DELIVER, 'deliver')
							}
						}
					}
				}
		   }
		stage('DeployImage Rancher') {
			when {
				anyOf { branch BRANCH_RC; branch BRANCH_BETA; branch BRANCH_ALPHA;
						tag pattern: "^\\d.\\d.\\d(-rc.\\d+)?", comparator: "REGEXP";
						tag pattern: "^\\d.\\d.\\d(-beta.\\d+)?", comparator: "REGEXP"
				}
			}
			environment {
				RANCHER_GLOBAL_USER_API_TOKEN_DEV_RANCHER = credentials('dev-rancher-jenkins-bot')
				RANCHER_GLOBAL_USER_API_TOKEN_RANCHER2 = credentials('rancher2-jenkins-bot')
				RANCHER_GLOBAL_USER_API_TOKEN_RANCHER3 = credentials('bdc-rancher-jenkins-bot')
			}
			parallel {
				stage('1. Alpha') {
					when  { anyOf { branch BRANCH_ALPHA } }
					steps {
							script {
							    cicd.deploy("alpha","${REGISTRY_DEVELOP}/${IMAGE_DEVELOP}")
							}
						}
					}
				stage('2. Beta') {
					when  { anyOf { branch BRANCH_BETA; tag pattern: "^\\d.\\d.\\d(-beta.\\d+)?", comparator: "REGEXP" } }
					steps {
							script {
							    cicd.deploy("beta","${REGISTRY_DEVELOP}/${IMAGE_DEVELOP}")
							}
						}
					}
				stage('3. RC') {
					when  { anyOf { branch BRANCH_RC; tag pattern: "^\\d.\\d.\\d(-rc.\\d+)?", comparator: "REGEXP" } }
					steps {
							script {
								cicd.deploy("rc","${REGISTRY_DEVELOP}/${IMAGE_DEVELOP}")
							}
						}
					}
				}
			}
		}

	post {
		failure {
			emailext (
				recipientProviders: [[$class: 'DevelopersRecipientProvider']],
				replyTo: 'DL-PE-CICD@tecnotree.com',
				subject: "Jenkins: Failed CICD Pipeline: ${currentBuild.fullDisplayName}",
				body: "Please review console log: ${env.BUILD_URL}"
			)
		}
	}
}

