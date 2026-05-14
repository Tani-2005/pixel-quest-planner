// Base URL for the Express backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic fetch wrapper for API calls
 */
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
}

// ---------------------------------------------------------
// Users API
// ---------------------------------------------------------
export const registerUser = (userData: { email: string; password?: string }) => {
  return fetchApi('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getUser = (userId: string) => {
  return fetchApi(`/users/${userId}`);
};

// ---------------------------------------------------------
// Profiles API
// ---------------------------------------------------------
export const getProfile = (userId: string) => {
  return fetchApi(`/profiles/${userId}`);
};

export const createOrUpdateProfile = (profileData: any) => {
  return fetchApi('/profiles', {
    method: 'POST',
    body: JSON.stringify(profileData),
  });
};

// ---------------------------------------------------------
// Tasks API
// ---------------------------------------------------------
export const getTasks = () => {
  return fetchApi('/tasks');
};

export const createTask = (taskData: any) => {
  return fetchApi('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

export const updateTask = (taskId: string, updateData: any) => {
  return fetchApi(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

export const deleteTask = (taskId: string) => {
  return fetchApi(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
};

// ---------------------------------------------------------
// Quests API
// ---------------------------------------------------------
export const getQuests = () => {
  return fetchApi('/quests');
};

export const createQuest = (questData: any) => {
  return fetchApi('/quests', {
    method: 'POST',
    body: JSON.stringify(questData),
  });
};
