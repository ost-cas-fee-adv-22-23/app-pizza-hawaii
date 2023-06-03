# define local variables: name and gcp_region
locals {
    name = "app-pizza-hawaii"
    gpc_region = "europe-west6"
}

# Project ID: project-pizza-388116
provider "google" {
  project = "project-pizza-388116"
  region  =  local.gpc_region
}

# Data source: google_project
data "google_project" "project" {
#  project_id = "project-pizza-388116"
}

# Bucket Backend for terraform state: 
# A cloud storage bucket is used to store the terraform state.
terraform {
  backend "gcs" {
    bucket  = "pizza-state-tf"
  }
}