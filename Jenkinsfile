pipeline {
    agent any
tools {
    sonarScanner 'SonarQubeScanner'  // ชื่อที่ตั้งไว้ใน Jenkins Global Tool Configuration
}

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/NarongritKlinloy/CircuitSimuInVR_Web.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {   // ✅ ต้องตรงกับชื่อ server ที่ตั้งใน Jenkins
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
