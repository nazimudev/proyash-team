
"use client";

import { useEffect, useState } from "react";
import { FolderKanban } from "lucide-react";
import { fetchProjects } from "@/services/projectService";

export default function ProjectSelector({ value, onChange }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchProjects();

        if (active) {
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
      >
        <option value="">
          {loading ? "Loading projects..." : "Choose a project"}
        </option>

        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">
          No projects found.
        </p>
      )}
    </div>
  );
}
