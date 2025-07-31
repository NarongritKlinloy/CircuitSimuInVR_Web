pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/NarongritKlinloy/CircuitSimuInVR_Web.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('retail-token') {   // ✅ ต้องตรงกับชื่อ server ที่ตั้งใน Jenkins
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
