pipeline {
    agent any

    environment {
        PROJECT_ID = "trusty-moment-476908-d1"
        REGION = "asia-south1"
        REPO = "my-repo"
        IMAGE = "springboot"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build JAR') {
            steps {
                sh '''
        cd backend/usersearch
        mvn clean package -DskipTests
        '''
            }
        }

        stage('Docker Build & Push') {
    steps {
        withCredentials([file(credentialsId: 'gcp-key', variable: 'GCP_KEY')]) {
            sh '''
            gcloud auth activate-service-account --key-file=$GCP_KEY
            gcloud auth configure-docker asia-south1-docker.pkg.dev -q

            cd backend/usersearch
            docker build -t asia-south1-docker.pkg.dev/trusty-moment-476908-d1/my-repo/springboot .
            docker push asia-south1-docker.pkg.dev/trusty-moment-476908-d1/my-repo/springboot
            '''
        }
    }
}

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/
                '''
            }
        }
    }
}
