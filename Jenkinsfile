pipeline {
    agent any

    tools {
        sonarQubeScanner 'sonar-scanner'
    }

    environment {
        SONARQUBE = credentials('retail-token') // หรือใช้ token ตรงๆ ก็ได้
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/NarongritKlinloy/CircuitSimuInVR_Web.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('retail-token') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
