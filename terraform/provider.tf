terraform {
  backend "s3" {
    bucket  = var.bucket
    key     = "state/terraform.tfstate"
    region  = var.region
    encrypt = true
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.22.0"
    }
  }
}

provider "aws" {
  region = var.region
}
