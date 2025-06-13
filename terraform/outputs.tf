output "frontend_url" {
  description = "Frontend application URL"
  value       = "http://localhost:${var.frontend_port}"
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://localhost:${var.backend_port}"
}

output "database_url" {
  description = "Database connection URL (sensitive)"
  value       = "postgresql://${var.db_user}:${var.db_password}@localhost:${var.db_port}/${var.db_name}"
  sensitive   = true
}

output "database_host" {
  description = "Database host"
  value       = "localhost"
}

output "database_port" {
  description = "Database port"
  value       = var.db_port
}

output "container_info" {
  description = "Container information"
  value = {
    frontend_container = {
      name   = docker_container.frontend.name
      id     = docker_container.frontend.id
      status = docker_container.frontend.exit_code == 0 ? "running" : "stopped"
    }
    backend_container = {
      name   = docker_container.backend.name
      id     = docker_container.backend.id
      status = docker_container.backend.exit_code == 0 ? "running" : "stopped"
    }
    db_container = {
      name   = docker_container.postgres.name
      id     = docker_container.postgres.id
      status = docker_container.postgres.exit_code == 0 ? "running" : "stopped"
    }
  }
}

output "network_name" {
  description = "Docker network name"
  value       = docker_network.ticketing_network.name
}

output "deployment_info" {
  description = "Deployment information"
  value = {
    app_name      = var.app_name
    environment   = var.environment
    frontend_port = var.frontend_port
    backend_port  = var.backend_port
    db_port       = var.db_port
    network       = docker_network.ticketing_network.name
  }
}