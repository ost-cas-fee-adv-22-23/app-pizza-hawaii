# define local variables

locals {
  name = "app-pizza-hawaii"
  gpc_region = "europe-west6"
  IMAGE  = var.IMAGE
  environment_vars = {
	NEXT_PUBLIC_VERCEL_URL	 	= var.NEXT_PUBLIC_VERCEL_URL,
	NEXTAUTH_URL				= var.NEXTAUTH_URL,
    NEXTAUTH_SECRET             = var.NEXTAUTH_SECRET,
    ZITADEL_ISSUER              = var.ZITADEL_ISSUER,
    ZITADEL_CLIENT_ID           = var.ZITADEL_CLIENT_ID,
    NEXT_PUBLIC_QWACKER_API_URL = var.NEXT_PUBLIC_QWACKER_API_URL
  }
}

# Project ID: project-pizza-388116
provider "google" {
  project = "project-pizza-388116"
  region  =  local.gpc_region
}

# Data source: google_project
data "google_project" "project" {
}

# Bucket Backend for terraform state:
# A cloud storage bucket is used to store the terraform state.
terraform {
  backend "gcs" {
    bucket  = "pizza-state-tf"
  }
}
