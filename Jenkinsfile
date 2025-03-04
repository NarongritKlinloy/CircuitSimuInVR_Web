pipeline {
    triggers {
        pollSCM('H/1 * * * *') // เช็คการเปลี่ยนแปลงจาก GitHub ทุกๆ 1 นาที
    }
    
    agent { label 'connect-admin3940' }

    environment {
        GITLAB_IMAGE_NAME = "registry.gitlab.com/threeman/deployprojectcircuitregistry"
        VMTEST_MAIN_WORKSPACE = "/home/connect-admin3940/workspace/connect-admin3940@2"
        DOCKER_PORT = "5000"
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                script {
                    echo "📥 Checking out source code from GitHub..."
                    checkout scm
                }
            }
        }

        stage('Build and Tag Docker Image') {
            steps {
                script {
                    echo "🔨 Building Docker image..."
                    sh "docker build -t ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER} ."
                }
            }
        }

        stage('Stop & Remove Existing Containers') {
            steps {
                script {
                    echo "🛑 Stopping and Removing existing containers..."
                    
                    // หยุดและลบ container ที่มีอยู่แล้วก่อนรัน docker-compose up
                    sh '''
                    docker ps -aq --filter "name=circuit-db" | xargs -r docker stop
                    docker ps -aq --filter "name=circuit-db" | xargs -r docker rm
                    docker ps -aq --filter "name=circuit-backend" | xargs -r docker stop
                    docker ps -aq --filter "name=circuit-backend" | xargs -r docker rm
                    '''
                }
            }
        }

        stage('Deploy Docker Compose') {
            steps {
                script {
                    echo "🚀 Deploying new containers..."
                    sh "docker-compose down --remove-orphans"
                    sh "docker-compose up -d --build"
                }
            }
        }

        stage('Delivery to GitLab Registry') {
            steps {
                script {
                    try {
                        withCredentials([usernamePassword(
                                credentialsId: 'gitlab-cred',
                                passwordVariable: 'gitlabPassword',
                                usernameVariable: 'gitlabUser'
                            )]
                        ) {
                            echo "🔑 Logging into GitLab registry..."
                            sh "docker login registry.gitlab.com -u ${gitlabUser} -p ${gitlabPassword}"

                            echo "📤 Tagging and pushing Docker image..."
                            sh "docker tag ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER} ${GITLAB_IMAGE_NAME}:latest"
                            sh "docker push ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER}"
                            sh "docker push ${GITLAB_IMAGE_NAME}:latest"

                            echo "🧹 Cleaning up local images..."
                            sh "docker rmi ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER}"
                        }
                    } catch (Exception e) {
                        echo "❌ Error during delivery: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                        error("Delivery to GitLab registry failed!")
                    }
                }
            }
        }

        stage("Pull from GitLab Registry") {
            steps {
                withCredentials(
                    [usernamePassword(
                        credentialsId: 'gitlab-cred',
                        passwordVariable: 'gitlabPassword',
                        usernameVariable: 'gitlabUser'
                    )]
                ) {
                    script {
                        echo "🛑 Stopping running containers..."
                        def containers = sh(script: "docker ps -q", returnStdout: true).trim()
                        if (containers) {
                            sh "docker stop ${containers}"
                        } else {
                            echo "✅ No running containers to stop."
                        }

                        echo "📥 Pulling latest Docker image..."
                        sh "docker login registry.gitlab.com -u ${gitlabUser} -p ${gitlabPassword}"
                        sh "docker pull ${GITLAB_IMAGE_NAME}:latest"

                        echo "🚀 Deploying latest Docker image..."
                        sh "docker run -p 5000:5000 -d ${GITLAB_IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully!"
        }
        failure {
            echo "❌ Deployment failed. Please check the logs."
        }
    }
}
