provider "google" {
  project = "your-gcp-project-id"
  region  = "your-gcp-region"
}
resource "google_project_service" "container_registry" {
  service = "containerregistry.googleapis.com"
  project = "your-gcp-project-id"
}
resource "null_resource" "docker_push" {
  depends_on = [google_project_service.container_registry]

  provisioner "local-exec" {
    command = <<EOT
      docker build -t gcr.io/${self.triggers.project_id}/${self.triggers.project_id}:${self.triggers.version} -f build.Dockerfile .
      gcloud auth configure-docker --quiet
      docker push gcr.io/${self.triggers.project_id}/${self.triggers.project_id}:${self.triggers.version}
    EOT
  }

  triggers = {
    project_id = "your-gcp-project-id"
    version = "your-version"
  }
}
