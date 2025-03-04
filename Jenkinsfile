pipeline {
    triggers {
        pollSCM('H/1 * * * *') // Check every 1 minutes
    }
    agent { label 'connect-admin3940' }
    environment {
        GITLAB_IMAGE_NAME = "registry.gitlab.com/threeman/deployprojectcircuitregistry"
        VMTEST_MAIN_WORKSPACE = "/home/connect-admin3940/workspace/connect-admin3940@2"
        DOCKER_PORT = "5000" // Specify the port to use
    }
    stages {
        stage('Deploy Docker Compose') {
            agent { label 'connect-admin3940' }
            steps {
                
                sh "docker compose up -d --build"
            }
        }


        stage('Delivery to GitLab Registry') {
            agent { label 'connect-admin3940' }
            steps {
                script {
                    try {
                        withCredentials([usernamePassword(
                                credentialsId: 'gitlab-cred',
                                passwordVariable: 'gitlabPassword',
                                usernameVariable: 'gitlabUser'
                            )]
                        ) {
                            echo "Logging into GitLab registry..."
                            sh "docker login registry.gitlab.com -u ${gitlabUser} -p ${gitlabPassword}"
                            echo "Tagging and pushing Docker image..."
                            sh "docker tag ${GITLAB_IMAGE_NAME} ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER}"
                            sh "docker push ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER}"
                            sh "docker rmi ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER}"
                        }
                    } catch (Exception e) {
                        echo "Error during delivery: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                        error("Delivery to GitLab registry failed!")
                    }
                }
            }
        }

        stage("Pull from GitLab Registry") {
            agent {label 'connect-admin3940'}
            steps {
                withCredentials(
                    [usernamePassword(
                        credentialsId: 'gitlab-cred',
                        passwordVariable: 'gitlabPassword',
                        usernameVariable: 'gitlabUser'
                    )]
                ) {
                    script {
                        def containers = sh(script: "docker ps -q", returnStdout: true).trim()
                        if (containers) {
                            sh "docker stop ${containers}"
                        } else {
                            echo "No running containers to stop."
                        }
                    }
                    sh "docker login registry.gitlab.com -u ${gitlabUser} -p ${gitlabPassword}"
                    sh "docker pull ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER}"
                    sh "docker run -p 5000:5000 -d ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER}"
                }
            }
        }
        
    }
}