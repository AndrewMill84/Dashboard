const API_BASE = "/api";

async function request(url, options) {
  const res = await fetch(`${API_BASE}${url}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function fetchProjects() {
  return request("/projects");
}

export function fetchProject(id) {
  return request(`/projects/${encodeURIComponent(id)}`);
}

export function fetchProjectFiles(id) {
  return request(`/projects/${encodeURIComponent(id)}/files`);
}

export function fetchFile(id, filename) {
  return request(
    `/projects/${encodeURIComponent(id)}/files/${encodeURIComponent(filename)}`
  );
}

export function fetchConfig() {
  return request("/config");
}

export function addScanDirectory(directory) {
  return request("/config/scan-directories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ directory }),
  });
}

export function removeScanDirectory(directory) {
  return request("/config/scan-directories", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ directory }),
  });
}

export function createProject(parentDirectory, folderName) {
  return request("/projects/bootstrap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parentDirectory, folderName }),
  });
}
