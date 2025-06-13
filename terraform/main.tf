# terraform/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Docker network for all services
resource "docker_network" "ticketing_network" {
  name = "${var.app_name}-network"
}

# PostgreSQL volume
resource "docker_volume" "postgres_data" {
  name = "${var.app_name}-postgres-data"
}

# PostgreSQL database
resource "docker_image" "postgres" {
  name         = "postgres:15"
  keep_locally = true
}

resource "docker_container" "postgres" {
  name  = "${var.app_name}-db"
  image = docker_image.postgres.image_id

  networks_advanced {
    name    = docker_network.ticketing_network.name
    aliases = ["postgres"]
  }

  ports {
    internal = 5432
    external = var.db_port
  }

  env = [
    "POSTGRES_USER=${var.db_user}",
    "POSTGRES_PASSWORD=${var.db_password}",
    "POSTGRES_DB=${var.db_name}"
  ]

  volumes {
    volume_name    = docker_volume.postgres_data.name
    container_path = "/var/lib/postgresql/data"
  }

  # Mount schema file if it exists
  dynamic "volumes" {
    for_each = fileexists("${path.cwd}/../backend/database/schema.sql") ? [1] : []
    content {
      host_path      = "${path.cwd}/../backend/database/schema.sql"
      container_path = "/docker-entrypoint-initdb.d/01-schema.sql"
      read_only      = true
    }
  }

  healthcheck {
    test     = ["CMD-SHELL", "pg_isready -U ${var.db_user}"]
    interval = "10s"
    timeout  = "5s"
    retries  = 5
  }

  restart = "unless-stopped"
}

# Backend application
resource "docker_image" "backend" {
  name = "${var.app_name}-backend:latest"
  build {
    context    = "${path.cwd}/../backend"
    dockerfile = "Dockerfile"
    tag        = ["${var.app_name}-backend:latest"]
  }
  keep_locally = true

  triggers = {
    dockerfile_hash   = filemd5("${path.cwd}/../backend/Dockerfile")
    package_json_hash = filemd5("${path.cwd}/../backend/package.json")
  }
}

resource "docker_container" "backend" {
  name  = "${var.app_name}-backend"
  image = docker_image.backend.image_id

  networks_advanced {
    name = docker_network.ticketing_network.name
  }

  ports {
    internal = 5000
    external = var.backend_port
  }

  env = [
    "PORT=5000",
    "DB_HOST=postgres",
    "DB_PORT=5432",
    "DB_NAME=${var.db_name}",
    "DB_USER=${var.db_user}",
    "DB_PASSWORD=${var.db_password}",
    "JWT_SECRET=${var.jwt_secret}",
    "NODE_ENV=${var.environment}"
  ]

  depends_on = [docker_container.postgres]
  restart    = "unless-stopped"

  healthcheck {
    test     = ["CMD", "curl", "-f", "http://localhost:5000/health"]
    interval = "30s"
    timeout  = "10s"
    retries  = 3
  }
}

# Frontend application
resource "docker_image" "frontend" {
  name = "${var.app_name}-frontend:latest"
  build {
    context    = "${path.cwd}/../frontend"
    dockerfile = "Dockerfile"
    tag        = ["${var.app_name}-frontend:latest"]
    build_args = {
      REACT_APP_API_URL = "http://localhost:${var.backend_port}"
    }
  }
  keep_locally = true

  triggers = {
    dockerfile_hash   = filemd5("${path.cwd}/../frontend/Dockerfile")
    package_json_hash = filemd5("${path.cwd}/../frontend/package.json")
  }
}

resource "docker_container" "frontend" {
  name  = "${var.app_name}-frontend"
  image = docker_image.frontend.image_id

  networks_advanced {
    name = docker_network.ticketing_network.name
  }

  ports {
    internal = 80
    external = var.frontend_port
  }

  env = [
    "REACT_APP_API_URL=http://localhost:${var.backend_port}"
  ]

  depends_on = [docker_container.backend]
  restart    = "unless-stopped"

  healthcheck {
    test     = ["CMD", "curl", "-f", "http://localhost:80"]
    interval = "30s"
    timeout  = "10s"
    retries  = 3
  }
}