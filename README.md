# Node.js + PostgreSQL GitOps App with KRO, Longhorn, MetalLB, and Argo CD

This project demonstrates a fully GitOps-managed, stateful Kubernetes application using:

- **KRO (Kubernetes Resource Orchestrator)** for declarative app definitions
- **PostgreSQL** backend with Longhorn PVC persistence
- **Custom Node.js frontend** served via a Docker image
- **MetalLB** for LoadBalancer IP allocation
- **Argo CD** for continuous Git-based deployment
- **Minikube** (single-node cluster) as the runtime environment

---

## Application Overview

The app provides a form for users to submit their **name and email**, stores entries in PostgreSQL, and displays submitted records in a table—all styled with Tailwind CSS.

---

## 🛠️ Architecture Diagram

```
User <--> MetalLB LoadBalancer IP
         |
         v
[ Node.js Frontend ] --> Sends form data
         |
         v
[ PostgreSQL DB ] --> Stores data on Longhorn PVC
```

---

## 📦 Components

| Component         | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| **Frontend**      | Node.js + Express form app (`moses101/form-app:latest`)                    |
| **Backend**       | PostgreSQL 15 with Longhorn volume for persistence                         |
| **Storage**       | Longhorn-backed PVC with `ReadWriteOnce` access                            |
| **Orchestration** | KRO CRDs + ResourceGraphDefinition automate StatefulSet, Deployment, etc.  |
| **Load Balancer** | MetalLB exposes frontend on cluster external IP                            |
| **GitOps**        | Argo CD syncs the app from this repo using `infra/argo/app.yaml`           |

---

## 🚀 Features

- ⚙️ **Declarative Infrastructure**: Powered by KRO's schema-driven app definitions.
- 💾 **Stateful PostgreSQL**: Stores submissions in a durable Longhorn volume.
- 🐳 **Custom Frontend Image**: Built and pushed to [Docker Hub](https://hub.docker.com/r/moses101/form-app).
- 📡 **MetalLB LoadBalancer**: Accessible via external IP (e.g., `http://10.0.2.240:8086`).
- 🔁 **Argo CD GitOps**: Auto-syncs from `main` branch to deploy app definitions.

---

## 📂 Directory Structure

```
.
├── app/                           # Node.js frontend app code
├── infra/
│   ├── argo/app.yaml             # Argo CD Application definition
│   └── kro/
│       ├── formapp-crd.yaml     # KRO Custom Resource Definition
│       ├── resourcegraphdefinition.yaml # KRO RGD (ResourceGraphDefinition)
│       ├── form-app-instance.yaml       # Frontend KRO instance
│       └── postgres-instance.yaml       # PostgreSQL KRO instance
```

---

## ⚙️ Key Commands for Demo

### 📌 Show Minikube Node

```bash
kubectl get nodes -o wide
```

### 📌 Show All Running Applications

```bash
kubectl get pods -n kro-apps
kubectl get svc -n kro-apps
```

### 📌 Confirm Argo CD Sync Status

```bash
kubectl get applications -n argocd
```

### 📌 Trigger Sync Manually (if needed)

```bash
argocd app sync form-app -n argocd
```

### 📌 Access the Frontend App

```bash
curl http://<metal-lb-ip>:8086
```

Example:

```bash
curl http://10.0.2.240:8086
```

### 📌 Insert and View PostgreSQL Data

```bash
kubectl exec -it postgres-0 -n kro-apps -- \
  psql -U postgres -d formdb -c \
  "INSERT INTO submissions (name, email) VALUES ('Moise', 'moise@example.com');"

kubectl exec -it postgres-0 -n kro-apps -- \
  psql -U postgres -d formdb -c '\dt'
```

---

## 💡 Learning Outcome

This project demonstrates the integration of:

- **KRO CRDs** to abstract deployment logic into reusable application instances.
- **Argo CD GitOps** syncing using Application manifests.
- **Longhorn** as persistent volume storage for stateful workloads.
- **MetalLB** to enable LoadBalancer services on local Minikube.
- **Docker Hub** as the source of a containerized frontend.

---

## 🧪 Future Improvements

- Enable Ingress with TLS (Cert-Manager).
- CI pipeline to auto-push custom Docker images.
- Use the secrets manager

---

## 🧑‍💻 Author

**Moise Iradukunda Ingabire**  
DevSecOps Intern
