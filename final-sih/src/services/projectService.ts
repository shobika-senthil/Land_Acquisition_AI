import { Project, RiskLevel } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000';

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const controller = new AbortController();

  // Prevent the page from being stuck forever
  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `API request failed (${response.status}): ${
          errorText || response.statusText
        }`
      );
    }

    return await response.json();
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        'The backend took too long to respond. Make sure Flask is running.'
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

interface ProjectsApiResponse {
  success?: boolean;
  count?: number;
  projects?: Project[];
}

export const projectService = {

  // =========================================================
  // GET ALL PROJECTS
  // =========================================================

  async getAllProjects(): Promise<Project[]> {
    const response =
      await request<Project[] | ProjectsApiResponse>(
        '/api/projects'
      );

    // Old API format:
    // [ project1, project2, ... ]
    if (Array.isArray(response)) {
      return response;
    }

    // Current backend format:
    // { success: true, projects: [...] }
    if (
      response &&
      Array.isArray(response.projects)
    ) {
      return response.projects;
    }

    return [];
  },

  // =========================================================
  // GET SINGLE PROJECT
  // =========================================================

  async getProjectById(
    id: string
  ): Promise<Project | undefined> {
    try {
      return await request<Project>(
        `/api/projects/${encodeURIComponent(id)}`
      );
    } catch (error) {
      console.error(
        'Failed to fetch project:',
        error
      );

      return undefined;
    }
  },

  // =========================================================
  // FILTER PROJECTS
  //
  // Kept for compatibility with other parts of the app.
  // The ProjectsPage itself now loads all projects once
  // and filters locally.
  // =========================================================

  async filterProjects(params: {
    state?: string;
    district?: string;
    riskLevel?: RiskLevel;
    sector?: string;
    status?: string;
    query?: string;
  }): Promise<Project[]> {

    const projects = await this.getAllProjects();

    const search =
      params.query?.trim().toLowerCase() || '';

    return projects.filter((project) => {

      // State filter
      if (
        params.state &&
        params.state !== 'All' &&
        project.state !== params.state
      ) {
        return false;
      }

      // District filter
      if (
        params.district &&
        params.district !== 'All' &&
        project.district !== params.district
      ) {
        return false;
      }

      // Sector filter
      if (
        params.sector &&
        params.sector !== 'All' &&
        project.sector !== params.sector
      ) {
        return false;
      }

      // Risk filter
      if (
        params.riskLevel &&
        project.riskLevel !== params.riskLevel
      ) {
        return false;
      }

      // Status filter
      if (
        params.status &&
        params.status !== 'All' &&
        project.status !== params.status
      ) {
        return false;
      }

      // Search
      if (search) {
        const searchableText = [
          project.id,
          project.code,
          project.name,
          project.district,
          project.state,
          project.sector,
          project.summary,
          project.topDelayDriver,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(search)) {
          return false;
        }
      }

      return true;
    });
  },

  // =========================================================
  // CREATE PROJECT
  // =========================================================

  async createProject(
    newProj: Partial<Project>
  ): Promise<Project> {
    return request<Project>(
      '/api/projects',
      {
        method: 'POST',
        body: JSON.stringify(newProj),
      }
    );
  },

};