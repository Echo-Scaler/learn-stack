variable "aws_region" {
  type        = string
  description = "Target AWS Region"
  default     = "ap-southeast-1"
}

variable "environment" {
  type        = string
  description = "Target Environment Name"
  default     = "dev"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR range for the Virtual Private Cloud"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type        = string
  description = "CIDR range for public subnet"
  default     = "10.0.1.0/24"
}
