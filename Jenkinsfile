pipeline {
    agent any

    tools {
        // ชื่อ tool ต้องตรงกับที่ตั้งไว้ใน Jenkins Global Tool Configuration
        sonarRunner 'SonarQubeScanner' 
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/NarongritKlinloy/CircuitSimuInVR_Web.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'  // หรือถ้าใช้ sonar-runner ให้เรียก sonar-runner
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
