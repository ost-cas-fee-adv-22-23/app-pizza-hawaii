locals {
    name = "app-pizza-hawaii"
    gpc_region = "europe-west6"
}

provider "google" {
  project = "project-pizza-388116"
  region  =  local.gpc_region
}

data "google_project" "project" {
#  project_id = "project-pizza-388116"
}

terraform {
  backend "gcs" {
    bucket  = "pizza-state-tf"
  }
}