pipeline {
    triggers {
        pollSCM('H/1 * * * *') // เช็คการเปลี่ยนแปลงจาก GitHub ทุกๆ 1 นาที
    }
    
    agent { label 'connect-admin3940' }

    environment {
        GITLAB_IMAGE_NAME = "registry.gitlab.com/threeman/deployprojectcircuitregistry"
        DOCKER_PORT = "5000"
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                script {
                    echo "Checking out source code from GitHub..."
                    checkout scm
                }
            }
        }

        stage('Build and Tag Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER} ."
                }
            }
        }

        stage('Stop & Remove Existing Containers') {
            steps {
                script {
                    echo "Stopping and Removing existing containers..."
                    
                    sh '''
                    # หยุดและลบ container ที่มีอยู่แล้วก่อนรัน docker-compose up
                    docker ps -aq --filter "name=circuit-db" | xargs -r docker stop || true
                    docker ps -aq --filter "name=circuit-db" | xargs -r docker rm || true
                    docker ps -aq --filter "name=circuit-backend" | xargs -r docker stop || true
                    docker ps -aq --filter "name=circuit-backend" | xargs -r docker rm || true
                    docker ps -aq --filter "name=circuit-frontend" | xargs -r docker stop || true
                    docker ps -aq --filter "name=circuit-frontend" | xargs -r docker rm || true
                    '''
                }
            }
        }

        stage('Check and Free Port') {
    steps {
        script {
            echo "Checking and Freeing Port ${DOCKER_PORT}..."
            sh '''
            PID=$(sudo lsof -ti :5000) || true
            if [ ! -z "$PID" ]; then
                echo "Stopping process using port 5000 (PID: $PID)..."
                sudo kill -9 $PID || true
            fi

            # ตรวจสอบและหยุด container ที่ใช้พอร์ต 5000
            CONTAINER_ID=$(docker ps -q --filter "publish=5000") || true
            if [ ! -z "$CONTAINER_ID" ]; then
                echo "Stopping container using port 5000 (Container: $CONTAINER_ID)..."
                docker stop $CONTAINER_ID || true
                docker rm $CONTAINER_ID || true
            fi
            '''
        }
    }
}


        stage('Deploy Docker Compose') {
            steps {
                script {
                    echo "Deploying new containers..."
                    sh '''
                    # ตรวจสอบว่าใช้ docker หรือ docker-compose
                    DOCKER_COMPOSE_CMD=$(which docker-compose || which docker compose || echo "")
                    
                    if [ -z "$DOCKER_COMPOSE_CMD" ]; then
                        echo "❌ ERROR: Docker Compose is not installed!"
                        exit 1
                    fi
                    
                    # ล้าง container และ volumes ที่ไม่ได้ใช้
                    docker system prune -f || true
                    docker volume prune -f || true
                    
                    # ปิด service เก่าก่อนเริ่มใหม่
                    $DOCKER_COMPOSE_CMD down || true
                    $DOCKER_COMPOSE_CMD up -d --build
                    '''
                }
            }
        }

        stage('Wait for Database to be Ready') {
            steps {
                script {
                    echo "Waiting for MySQL to be ready..."
                    sh '''
                    MAX_RETRIES=30
                    COUNTER=0
                    until docker exec circuit-db mysqladmin ping -h"localhost" --silent; do
                        COUNTER=$((COUNTER+1))
                        if [ $COUNTER -ge $MAX_RETRIES ]; then
                            echo "❌ ERROR: MySQL did not become ready in time!"
                            exit 1
                        fi
                        echo "⏳ Waiting for MySQL to be ready... ($COUNTER/$MAX_RETRIES)"
                        sleep 5
                    done
                    echo "✅ MySQL is ready!"
                    '''
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
                            echo "Logging into GitLab registry..."
                            sh "docker login registry.gitlab.com -u ${gitlabUser} -p ${gitlabPassword}"

                            echo "Tagging and pushing Docker image..."
                            sh "docker tag ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER} ${GITLAB_IMAGE_NAME}:latest"
                            sh "docker push ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER}"
                            sh "docker push ${GITLAB_IMAGE_NAME}:latest"

                            echo "Cleaning up local images..."
                            sh "docker rmi ${GITLAB_IMAGE_NAME}:${env.BUILD_NUMBER} || true"
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
            steps {
                withCredentials(
                    [usernamePassword(
                        credentialsId: 'gitlab-cred',
                        passwordVariable: 'gitlabPassword',
                        usernameVariable: 'gitlabUser'
                    )]
                ) {
                    script {
                        echo "Stopping running containers..."
                        def containers = sh(script: "docker ps -q", returnStdout: true).trim()
                        if (containers) {
                            sh '''
                            for container in $(docker ps -q); do
                                docker stop $container || true
                                docker rm $container || true
                            done
                            '''
                        } else {
                            echo "No running containers to stop."
                        }

                        echo "Pulling latest Docker image..."
                        sh "docker login registry.gitlab.com -u ${gitlabUser} -p ${gitlabPassword}"
                        sh "docker pull ${GITLAB_IMAGE_NAME}:latest"

                        echo "Deploying latest Docker image..."
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
