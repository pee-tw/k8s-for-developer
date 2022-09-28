# Welcome to Kubernetes Study Group Lab
## Part 1: Getting Kubernetes running locally
The easiest way to get Kubernetes running on Mac is to install Colima

`brew install colima`

Then, run colima with some profile name. In our case let's name it `k8s` (This can be anything really). 

`colima start k8s --kubernetes`

This command will create a VM with and setup Kubernetes as well as the necessary network mapping for us. The default configration will create 2 CPUs, 2GiB memory and 60GiB storage, which we can override with 

`colima start k8s --cpu 4 --memory 8 --disk 40`

or simple edit before starting later with

`colima edit k8s --cpu 6 --memory 8 --disk 50`

- To see, Colima VMs run `colima list`
- To stop the VMs run `colima stop k8s`
- For consequent run we don't need to specify --kubernetes flag anymore. Just run `colima start k8s` to bring the VM back.

You can also run start without a profile name, in which case it'll be the default. I generally recommend keeping the default as Docker one. And non-default as Kubernetes since Kubernetes create a lot of containers making `docker ps` difficult to read.

If you can run `kubectl get pod -A` and see some pods running then congratulations! You have a local Kubernetes cluster now.

If you don't have `kubectl` then, you can install it with by following the instructions [here](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/).

## Part 2: Deploying a Hello World Container
Let's deploy a Hello world container!

First, let's setup an Ingress (Reverse Proxy). So that, we can access multiple workload on our local machine without messing around with IP. The easiest way is to use `Nginx Ingress`, which we can easily install with helm (Kubernetes' Package Manager)

We can check if whether we already have helm installed with 

`helm version`

If you get command not found then, install helm with 

`brew install kubernetes-helm`

Then, add Nginx Ingress's helm repo with

`helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`

Then, install Nginx Ingress with

`helm install nginx-ingress ingress-nginx/ingress-nginx`

After that, create an Ingress with

`kubectl apply -f ingress.yaml`

Then, add url alias of your choice to `/etc/hosts` that url should match the ones you've specified in `ingress.yaml`

Then, actually deploy the workload with

```
kubectl apply -f tutum-hello-world
kubectl apply -f nginx-hello-world
```
Now, navigate open your browser to `tutum-hello-world.local/` or anything that you've setup. Try refreshing the page while holding shift to see hostname changes in a round robin fashion.

Navigate to `nginx-hello-world.local/` to see nginx being deployed on the same port and same ip.

Congratulations, you have a basic setup of Kubernetes!

## Part 3: Persistent (PVCs) and Secrets
First, let's create MySQL in our Cluster.
```
kubectl create secret generic mysql --from-literal=password=randompassword 
kubectl create secret generic database-url --from-literal=url='mysql://root:randompassword@mysql:3306/nestjs_demo'
cd persistent-demo
kubectl apply -f mysql
kubectl port-forward service/mysql 3307:3306
```
Then, let's try connecting to it with our NestJS backend application.
```
cd hello-prisma
npm i # Install dependencies
npx prisma migrate dev
npm run start:dev
```
Let's say that we're happy then we can deploy our application to the cluster with

`kubectl apply -f k8s`

And there we have it! A simple application that demonstrate internal cluster communication, secrets and persistent!
# Resources
## Getting more ready made recipes
Visit [Kubeapps](https://kubeapps.dev/) for more info
## Certifications
If you feel up to the challenge, you can put a little more effort and take an [exam](https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/)
## Deeper dive to Kubernetes
If you want more of this and not afraid to get your hands really dirty, then I highly recommend 
[kubernetes-the-hard-way](https://github.com/kelseyhightower/kubernetes-the-hard-way)