# account for runner to deploy to cloud run
resource "google_service_account" "cloud-runner" {
  account_id   = "cloud-runner"
  display_name = "Google Cloud Run Pizza Runner"
  description  = "Account to deploy applications to google cloud run."
}

# role management for cloud-runner
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

# reference to googleproject from main.tf
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
resource "google_secret_manager_secret" "default" {
  secret_id = "NEXTAUTH_SECRET"

  replication {
    user_managed {
      replicas {
        location = local.gpc_region
      }
    }
  }
}
# cloud template for our cloud run service app-pizza-hawaii
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
            "memory" = "1G"
            "cpu"    = "2.0"
          }
        }

        env {
          name = "NEXTAUTH_URL"
          value = "https://app-pizza-hawaii-rcosriwdxq-oa.a.run.app"
        }

        env {
          name = "NEXTAUTH_SECRET"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.default.secret_id
              key = "1"
            }
          }
        }

        env {
          name = "ZITADEL_ISSUER"
          value = "https://cas-fee-advanced-ocvdad.zitadel.cloud"
        }

        env {
          name = "ZITADEL_CLIENT_ID"
          value = "181236603920908545@cas_fee_adv_qwacker_prod"
        }

        env {
          name = "NEXT_PUBLIC_QWACKER_API_URL"
          value = "https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/"
        }

        env {
          name = "NEXT_PUBLIC_VERCEL_URL"
          value = "https://app-pizza-hawaii-rcosriwdxq-oa.a.run.app"
        }

        ports {
          name           = "http1"
          container_port = 3000
        }
      }

      service_account_name = google_service_account.cloud-runner.email
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

output "cloud-run-url" {
  value = google_cloud_run_service.app-pizza-hawaii.status[0].url
}

# all users can invoke the service without beeing authenticated on google to access our app.
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.app-pizza-hawaii.location
  project  = google_cloud_run_service.app-pizza-hawaii.project
  service  = google_cloud_run_service.app-pizza-hawaii.name

  policy_data = data.google_iam_policy.noauth.policy_data
}