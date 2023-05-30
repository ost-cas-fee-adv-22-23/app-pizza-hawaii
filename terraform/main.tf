locals {
    name = "pizza-hawaii-test"
    gpc_region = "europe-west6"
}

provider "google" {
  project = "artful-bonsai-387618"
  region  = "europe-west6"
}

data "google_project" "project" {
#   project_id = "artful-bonsai-387618"
}

terraform {
  backend "gcs" {
    bucket  = "artful-bonsai-387618-tf-state"
  }
}