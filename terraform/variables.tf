variable "IMAGE" {
  type        = string
  description = "Image URL"
}

variable "NEXT_PUBLIC_VERCEL_URL" {
  type        = string
  description = "URL of the deployed application"
}

variable "NEXTAUTH_URL" {
  type        = string
  description = "URL of NextAuth"
}

variable "NEXTAUTH_SECRET" {
  type        = string
  description = "Secret for NextAuth"
}

variable "ZITADEL_ISSUER" {
  type        = string
  description = "Issuer for Zitadel"
}

variable "ZITADEL_CLIENT_ID" {
  type        = string
  description = "Client ID for Zitadel"
}

variable "NEXT_PUBLIC_QWACKER_API_URL" {
  type        = string
  description = "URL of the API"
}
