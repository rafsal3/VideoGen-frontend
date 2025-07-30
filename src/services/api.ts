const BASE_URL = 'http://localhost:8000';
type ParameterValue = string | number | boolean | string[] | number[];


export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Template {
  template_id: string;
  name: string;
  description: string;
  category: string;
  parameters_schema: Record<string, ParameterValue>;
  preview_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  resolution: string;
  created_at: string;
  is_premium: boolean;
  is_active: boolean;
  render_engine: string;
  tags: string[];
  is_saved: boolean;
  total_saves: number;
}

export interface Project {
    _id: string;
    project_id: string;
    user_id: string;
    template_id: string;
    name: string;
    description: string;
    parameters: Record<string, ParameterValue>;
    status: string;
    render_quality: string;
    video_url: string;
    thumbnail_url: string;
    duration_seconds: number;
    file_size_mb: number;
    render_started_at: string;
    render_completed_at: string;
    created_at: string;
    updated_at: string;
    is_public: boolean;
    template_info: {
      name: string;
      category: string;
      thumbnail_url: string;
    };
  }

  

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  async getCurrentUser(token: string): Promise<User> {
    return this.request<User>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getTemplates(token: string): Promise<Template[]> {
    return this.request<Template[]>('/templates/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getCategories(token: string): Promise<string[]> {
    const res = await this.request<{ categories: string[] }>('/templates/categories', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.categories;
  }

  async getTemplatesByCategory(token: string, category: string): Promise<Template[]> {
    return this.request<Template[]>(`/templates/category/${encodeURIComponent(category)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getProjects(token: string): Promise<Project[]> {
    return this.request<Project[]>('/projects/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getSavedTemplates(token: string): Promise<Template[]> {
  return this.request<Template[]>('/templates/saved/my-templates', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

  async saveTemplate(token: string, templateId: string): Promise<{ message: string }> {
  return this.request<{ message: string }>(`/templates/${templateId}/save`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

  async unsaveTemplate(token: string, templateId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/templates/${templateId}/unsave`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getTemplateById(token: string, templateId: string): Promise<Template> {
  return this.request<Template>(`/templates/${templateId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

// Fix for the createProject method in your api.ts file
async createProject(
  token: string,
  data: {
    template_id: string;
    name: string;
    description: string;
    parameters: Record<string, unknown>;
    render_quality: string;
  }
): Promise<{ message: string; project_id: string; _id: string }> {
  return this.request<{ message: string; project_id: string; _id: string }>('/projects/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

  async getProjectById(token: string, projectId: string): Promise<Project> {
  return this.request<Project>(`/projects/${projectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });




}
  async renderProject(token: string, projectId: string): Promise<{ message: string; project_id: string; status: string }> {
  return this.request<{ message: string; project_id: string; status: string }>(
    `/projects/${projectId}/render`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
}

async deleteProject(token: string, projectId: string): Promise<{ message: string }> {
  return this.request<{ message: string }>(`/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}



}
export const apiService = new ApiService(); 

