# account for runner to deploy to cloud run
resource "google_service_account" "cloud-runner" {
  account_id   = "cloud-runner"
  display_name = "Google Cloud Run Pizza Hawaii Runner"
  description  = "Account to deploy Pizza App Container to Google Cloud Run."
}

# role management for cloud-runner
# cloud runner needs these roles from google cloud platform to deploy our app
resource "google_project_iam_member" "cloud-runner" {
  for_each = toset([
    "roles/run.serviceAgent",
    "roles/viewer",
    "roles/storage.objectViewer",
    "roles/run.admin",
    "roles/secretmanager.secretAccessor",
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.cloud-runner.email}"
  project = data.google_project.project.id
}

# reference to google_project from main.tf
# service accout for cloud runner (Note: click in the admin gui to create a service account first !)
# number and Id are needed to create the service account for cloud runner
resource "google_project_iam_member" "cloud-runner-svc" {
  role    = "roles/run.serviceAgent"
  member  = "serviceAccount:service-${data.google_project.project.number}@serverless-robot-prod.iam.gserviceaccount.com"
  project = data.google_project.project.id
}

output "cloud-runner-email" {
  value = google_service_account.cloud-runner.email
}

# cloud run service - our pizza image
# we need to create a secret for our nextauth secret using google_secret_manager_secret

data "google_secret_manager_secret_version" "nextauth_secret" {
  provider = google

  secret  = "nextauth_secret"
  version = "1"
}

# cloud template for our cloud run service app-pizza-hawaii
# we need to set the environment variables for our app
# logs showed that the container is running best with 2G memory and 2 cpu
# non-confidential environment variables are set in the template
# confidential environment variables are set in the secret manager
resource "google_cloud_run_service" "app-pizza-hawaii" {
  name                       = local.name
  location                   = local.gpc_region
  autogenerate_revision_name = true

  template {
    spec {
      containers {
         image = "europe-west6-docker.pkg.dev/project-pizza-388116/pizza-repo/app-pizza-hawaii"
        resources {
          limits = {
            "memory" = "256Mi"
          }
        }

        dynamic "env" {
          for_each = local.environment_vars
          content {
            name  = env.key
            value = env.value
          }
        }

        ports {
          name           = "http1"
          container_port = 3000
        }
      }

      service_account_name = google_service_account.cloud-runner.email
    }
  }
    # traffic is routed to the latest revision: all users will see the latest version of our app
  traffic {
    percent         = 100
    latest_revision = true
  }
}

# if we want to deploy a new version of our app, we need to create a new revision
# so current revision is latest revision -> status[0].url
output "cloud-run-url" {
  value = google_cloud_run_service.app-pizza-hawaii.status[0].url
}

# all users can invoke the service without beeing authenticated on google to access our app.
# as Zitadel is our identity provider, we don't need to authenticate users on google.
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

# policies setting
resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.app-pizza-hawaii.location
  project  = google_cloud_run_service.app-pizza-hawaii.project
  service  = google_cloud_run_service.app-pizza-hawaii.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
