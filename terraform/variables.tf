variable "app_name" {
  description = "Application name"
  type        = string
  default     = "ticketing-app"
  
  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.app_name))
    error_message = "App name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "ticketing_db"
}

variable "db_user" {
  description = "Database user"
  type        = string
  default     = "your_user"
}

variable "db_password" {
  description = "Database password"
  type        = string
  default     = "your_pass"
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  default     = "your-secret-key"
  sensitive   = true
}

variable "backend_port" {
  description = "External port for the backend API"
  type        = number
  default     = 5000
  
  validation {
    condition     = var.backend_port > 1000 && var.backend_port < 65536
    error_message = "Backend port must be between 1000 and 65535."
  }
}

variable "frontend_port" {
  description = "External port for the frontend"
  type        = number
  default     = 3000
  
  validation {
    condition     = var.frontend_port > 1000 && var.frontend_port < 65536
    error_message = "Frontend port must be between 1000 and 65535."
  }
}

variable "db_port" {
  description = "External port for the database"
  type        = number
  default     = 5433
  
  validation {
    condition     = var.db_port > 1000 && var.db_port < 65536
    error_message = "Database port must be between 1000 and 65535."
  }
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "auto_rebuild" {
  description = "Automatically rebuild images when source files change"
  type        = bool
  default     = true
}