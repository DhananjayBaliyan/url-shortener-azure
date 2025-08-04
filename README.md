Shortly: A Cloud-Native URL Shortener on Kubernetes

![Shortly Application Screenshot](shortly_main.jpg)

🚀 Project Overview
Shortly is a fully functional URL shortening microservice application, built from the ground up and deployed on Microsoft Azure. This project demonstrates a comprehensive, hands-on understanding of modern cloud engineering and DevOps principles, including containerization, Kubernetes orchestration, CI/CD automation, and resilient cloud networking.

The application is composed of three core, decoupled services:

Frontend Service: A Python Flask and JavaScript single-page application (SPA) featuring GSAP animations that provides the user interface for creating and viewing shortened links.

Backend API Service: A Python Flask API that handles the core logic for generating unique short codes, storing URL mappings in a database, and retrieving them for redirection.

Database Service: A Redis instance for high-performance, in-memory storage of URL mappings, ensuring fast lookups and redirects.

All services are deployed as versioned containers within an Azure Kubernetes Service (AKS) cluster. The entire deployment process is automated through a GitHub Actions CI/CD pipeline, ensuring consistent and reliable releases.

🏗️ Technical Architecture
This project utilizes a modern, cloud-native architecture designed for scalability, resilience, and maintainability. The infrastructure is fully defined through declarative YAML manifests and automated with a CI/CD pipeline.

Cloud Deployment Architecture (Azure & GitHub Actions)
This diagram illustrates the flow of a code change from a git push to a live deployment on Azure, and how a user interacts with the final application.

graph TD
    subgraph GitHub
        direction LR
        DEV[Developer] -- "1. git push" --> GHA[GitHub Actions Workflow]
    end

    subgraph "Azure Cloud (Resource Group: ks-portfolio-rg)"
        ACR[Azure Container Registry]
        
        subgraph "AKS Cluster: shortly-cluster"
            NGINX[NGINX Ingress Controller]

            subgraph "Frontend Pods"
                direction LR
                FP1(Frontend)
                FP2(Frontend)
            end

            subgraph "Backend Pod"
                BP1(Backend)
            end
            
            subgraph "Database Pod"
                DB1(Redis)
            end

            FSVC[Frontend Service]
            BSVC[Backend Service]
            RSVC[Redis Service]
            
            NGINX -- "path: /" --> FSVC
            NGINX -- "path: /api" --> BSVC
            
            FSVC --> FP1 & FP2
            BSVC --> BP1
            BP1 -- "reads/writes to" --> RSVC
            RSVC --> DB1
        end
    end
    
    subgraph Internet
        U[User's Browser]
    end

    GHA -- "2. Builds & Pushes Images" --> ACR
    GHA -- "3. Deploys to AKS (kubectl apply)" --> NGINX
    
    U -- "4. Accesses Public IP" --> NGINX

    style DEV fill:#d1e7dd,stroke:#333,stroke-width:2px
    style U fill:#d1e7dd,stroke:#333,stroke-width:2px

Local Development Architecture (Docker Compose)
This diagram shows how the same containerized services are run locally for development and testing using Docker Compose, ensuring consistency between environments.

graph TD
    subgraph "Your Local Machine"
        B[User's Browser] -- "http://localhost:8080" --> F_PORT

        subgraph Docker Network
            direction LR
            
            subgraph Frontend Container
                F_PORT[Port 8080] --> F_APP[Frontend App]
            end

            subgraph Backend Container
                B_PORT[Port 5001] --> B_APP[Backend API]
            end
            
            subgraph Redis Container
                R_PORT[Port 6379] --> R_DB[Redis DB]
            end

            F_APP -- "fetch('http://localhost:5001/...')" --> B_PORT
            B_APP -- "connects to 'redis'" --> R_PORT
        end
    end

    style B fill:#d1e7dd,stroke:#333,stroke-width:2px

🛠️ Tech Stack & Key Concepts
Category

Technology / Concept

Cloud Provider

Microsoft Azure

CI/CD

GitHub Actions

Containerization

Docker, Docker Compose

Orchestration

Azure Kubernetes Service (AKS)

Container Registry

Azure Container Registry (ACR)

Networking

NGINX Ingress Controller, Kubernetes Services

Backend

Python, Flask, Redis

Frontend

Python, Flask, JavaScript, HTML/CSS, GSAP

Deployment

Declarative YAML, kubectl, Helm

🌟 Key Features & Skills Demonstrated
End-to-End CI/CD Automation: Implemented a full CI/CD pipeline using GitHub Actions that automatically builds, versions, and deploys the entire application to Kubernetes on every push to the main branch.

Microservice Architecture: Successfully designed and deployed a decoupled application, allowing for independent scaling and development of the frontend and backend.

Containerization & Versioning: Wrote custom Dockerfiles for each service and used commit SHAs as unique image tags, demonstrating best practices for building and versioning container images.

Kubernetes Deployment & Management: Deployed and managed all services on AKS using declarative YAML manifest files, showcasing proficiency in Deployments, Services, and Ingress.

Advanced Networking with Ingress: Implemented an industry-standard NGINX Ingress controller to manage all external traffic, intelligently routing requests to the appropriate microservice based on the URL path.

Cloud Infrastructure Provisioning: All necessary Azure resources, including the AKS cluster and ACR, were provisioned and configured from scratch using the Azure CLI.

Real-World Problem Solving: Diagnosed and resolved a wide range of complex, real-world issues, including:

Azure subscription limitations (VM sizes, availability zones, addon restrictions).

Container image pull permissions (ImagePullBackOff).

Complex Ingress routing bugs (404 errors, path rewriting, static file serving).

Cross-Origin Resource Sharing (CORS) errors between services.

⚙️ How to Run
The entire application state is defined in code and YAML manifests within this repository.

Cloud Deployment (Automated via GitHub Actions)
Fork this repository.

Create Azure Resources: Provision an Azure Resource Group, ACR, and AKS cluster.

Create a Service Principal: Generate credentials for GitHub Actions to log in to Azure.

Add GitHub Secrets: Add the AZURE_CREDENTIALS to your repository's secrets.

Push a change to the main branch. The GitHub Actions workflow will automatically build and deploy the entire application.

Get the public IP address of the Ingress to access the application:

kubectl get ingress

Local Development (Docker Compose)
Ensure Docker Desktop is running.

Navigate to the project's root directory.

Run docker-compose up --build.

Access the application at http://localhost:8080.

📈 Project Status
The application is fully functional. Future improvements could include:

Adding a custom domain name and TLS certificate.

Implementing automated testing in the CI/CD pipeline.

Adding analytics to track link clicks.

Persisting Redis data to a volume to survive pod restarts.
