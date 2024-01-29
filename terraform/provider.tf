terraform {
  backend "s3" {
    bucket  = "stg16statebucket"
    key     = "state/terraform.tfstate"
    region  = "eu-west-3"
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
