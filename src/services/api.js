import axios from 'axios';
import {
  INITIAL_USER,
  INITIAL_ADMIN,
  MOCK_CATEGORIES,
  MOCK_LOCATIONS,
  MOCK_DEPARTMENTS,
  MOCK_STAFF,
  INITIAL_PROBLEMS,
  INITIAL_ADMIN_NOTIFICATIONS
} from '../utils/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cpt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const initMockStorage = () => {
  if (!localStorage.getItem('cpt_mock_problems')) {
    localStorage.setItem('cpt_mock_problems', JSON.stringify(INITIAL_PROBLEMS));
  }
  if (!localStorage.getItem('cpt_mock_departments')) {
    localStorage.setItem('cpt_mock_departments', JSON.stringify(MOCK_DEPARTMENTS));
  }
  if (!localStorage.getItem('cpt_mock_staff')) {
    localStorage.setItem('cpt_mock_staff', JSON.stringify(MOCK_STAFF));
  }
  if (!localStorage.getItem('cpt_mock_categories')) {
    localStorage.setItem('cpt_mock_categories', JSON.stringify(MOCK_CATEGORIES));
  }
  if (!localStorage.getItem('cpt_mock_locations')) {
    localStorage.setItem('cpt_mock_locations', JSON.stringify(MOCK_LOCATIONS));
  }
  if (!localStorage.getItem('cpt_mock_admin_notifications')) {
    localStorage.setItem('cpt_mock_admin_notifications', JSON.stringify(INITIAL_ADMIN_NOTIFICATIONS));
  }
};
initMockStorage();

export const apiService = {
  // Student Login
  async login(college_id, password) {
    try {
      const response = await apiClient.post('/auth/login', { college_id, password });
      if (response.data.user?.role === 'admin') {
        throw new Error('This account has admin credentials. Please use the Admin Portal login.');
      }
      return response.data;
    } catch (err) {
      if (err.message && err.message.includes('admin credentials')) {
        throw err;
      }
      if (college_id.toUpperCase().startsWith('ADMIN')) {
        throw new Error('Admin account detected. Please use the Admin Portal login page.');
      }
      if (!college_id || !password) throw new Error('College ID and Password are required.');
      if (password.length < 4) throw new Error('Password must be at least 4 characters.');

      const user = {
        ...INITIAL_USER,
        college_id: college_id.toUpperCase(),
        name: college_id.toUpperCase().startsWith('CS') ? 'Alex Morgan' : 'Campus User'
      };

      return {
        success: true,
        token: `student_jwt_token_${Date.now()}`,
        user
      };
    }
  },

  // Dedicated Admin Login
  async adminLogin(college_id, password) {
    try {
      const response = await apiClient.post('/admin/auth/login', { college_id, password });
      if (response.data.user?.role !== 'admin') {
        throw new Error('You are not authorized to access the admin portal.');
      }
      return response.data;
    } catch (err) {
      if (err.message && err.message.includes('authorized')) throw err;
      
      const cid = college_id ? college_id.toUpperCase() : '';
      if (!cid.startsWith('ADMIN') && cid !== 'ADMIN001') {
        throw new Error('You are not authorized to access the admin portal. Only authorized ADMIN accounts are permitted.');
      }

      if (password.length < 4) throw new Error('Password must be at least 4 characters.');

      return {
        success: true,
        token: `admin_jwt_token_${Date.now()}`,
        user: INITIAL_ADMIN
      };
    }
  },

  async getMe() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (err) {
      const storedUser = localStorage.getItem('cpt_user_profile');
      return storedUser ? JSON.parse(storedUser) : INITIAL_USER;
    }
  },

  // Problems (User & Admin shared read/write)
  async getProblems(params = {}) {
    try {
      const endpoint = params.isAdmin ? '/admin/problems' : '/problems';
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (err) {
      let problems = JSON.parse(localStorage.getItem('cpt_mock_problems') || '[]');
      
      if (params.status && params.status !== 'ALL') {
        problems = problems.filter(p => p.status === params.status);
      }
      if (params.priority && params.priority !== 'ALL') {
        problems = problems.filter(p => p.current_priority === params.priority || p.user_priority === params.priority);
      }
      if (params.category && params.category !== 'ALL') {
        problems = problems.filter(p => p.category_id === params.category || p.category_name?.toLowerCase().includes(params.category.toLowerCase()));
      }
      if (params.department && params.department !== 'ALL') {
        problems = problems.filter(p => p.assigned_department_id === params.department || p.assigned_department?.toLowerCase().includes(params.department.toLowerCase()));
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        problems = problems.filter(p => 
          p.ticket_id.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          (p.reporter_id && p.reporter_id.toLowerCase().includes(query)) ||
          (p.category_name && p.category_name.toLowerCase().includes(query))
        );
      }

      if (params.sortBy === 'oldest') {
        problems.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      } else if (params.sortBy === 'updated') {
        problems.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      } else {
        problems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      return {
        success: true,
        count: problems.length,
        problems
      };
    }
  },

  async getProblemById(id) {
    try {
      const response = await apiClient.get(`/admin/problems/${id}`);
      return response.data;
    } catch (err) {
      const problems = JSON.parse(localStorage.getItem('cpt_mock_problems') || '[]');
      const problem = problems.find(p => p.id === id || p.ticket_id === id);
      if (!problem) throw new Error('Problem ticket not found.');
      return { success: true, problem };
    }
  },

  async createProblem(problemData) {
    try {
      const response = await apiClient.post('/problems', problemData);
      return response.data;
    } catch (err) {
      const problems = JSON.parse(localStorage.getItem('cpt_mock_problems') || '[]');
      const newId = `prob_${Date.now()}`;
      const ticketNum = String(problems.length + 1).padStart(4, '0');
      const ticketId = `CPT-2026-${ticketNum}`;
      const now = new Date().toISOString();

      const newProblem = {
        id: newId,
        ticket_id: ticketId,
        title: problemData.title,
        description: problemData.description,
        category_id: problemData.category_id || "cat_other",
        category_name: problemData.category_name || "General",
        reporter_id: INITIAL_USER.college_id,
        reporter_name: INITIAL_USER.name,
        location: {
          building: problemData.building || 'Main Campus Block',
          floor: problemData.floor || '1st Floor',
          room: problemData.room || 'General Area'
        },
        user_priority: problemData.priority || 'MEDIUM',
        current_priority: problemData.priority || 'MEDIUM',
        status: 'REPORTED',
        image_url: problemData.image_url || null,
        created_at: now,
        updated_at: now,
        assigned_department: null,
        assigned_staff: null,
        timeline: [
          { status: 'REPORTED', title: 'Problem Reported', timestamp: now, note: 'Ticket created by user.' }
        ]
      };

      problems.unshift(newProblem);
      localStorage.setItem('cpt_mock_problems', JSON.stringify(problems));
      return { success: true, ticket_id: ticketId, problem: newProblem };
    }
  },

  // Admin Priority Control
  async updateProblemPriority(id, priority) {
    try {
      const response = await apiClient.put(`/admin/problems/${id}/priority`, { priority });
      return response.data;
    } catch (err) {
      const problems = JSON.parse(localStorage.getItem('cpt_mock_problems') || '[]');
      const index = problems.findIndex(p => p.id === id || p.ticket_id === id);
      if (index === -1) throw new Error('Problem not found.');

      const now = new Date().toISOString();
      problems[index].current_priority = priority;
      problems[index].updated_at = now;
      
      localStorage.setItem('cpt_mock_problems', JSON.stringify(problems));
      return { success: true, message: 'Priority updated successfully.', problem: problems[index] };
    }
  },

  // Admin Department & Staff Assignment
  async assignProblem(id, departmentId, staffId = null) {
    try {
      const response = await apiClient.put(`/admin/problems/${id}/assign`, { department_id: departmentId, staff_id: staffId });
      return response.data;
    } catch (err) {
      const problems = JSON.parse(localStorage.getItem('cpt_mock_problems') || '[]');
      const depts = JSON.parse(localStorage.getItem('cpt_mock_departments') || '[]');
      const staffList = JSON.parse(localStorage.getItem('cpt_mock_staff') || '[]');
      
      const index = problems.findIndex(p => p.id === id || p.ticket_id === id);
      if (index === -1) throw new Error('Problem not found.');

      const deptObj = depts.find(d => d.id === departmentId);
      const staffObj = staffList.find(s => s.id === staffId);
      const now = new Date().toISOString();

      problems[index].assigned_department_id = departmentId;
      problems[index].assigned_department = deptObj ? deptObj.name : 'Maintenance Department';
      if (staffObj) {
        problems[index].assigned_staff_id = staffObj.id;
        problems[index].assigned_staff_name = staffObj.name;
      }

      if (problems[index].status === 'REPORTED' || problems[index].status === 'VERIFIED') {
        problems[index].status = 'ASSIGNED';
      }
      problems[index].updated_at = now;

      problems[index].timeline.push({
        status: 'ASSIGNED',
        title: 'Assigned to Department',
        timestamp: now,
        note: `Assigned to ${problems[index].assigned_department}${staffObj ? ` (${staffObj.name})` : ''}.`
      });

      localStorage.setItem('cpt_mock_problems', JSON.stringify(problems));
      return { success: true, message: 'Assignment updated.', problem: problems[index] };
    }
  },

  // Admin Status Control
  async updateProblemStatus(id, status, note = '', reason = '') {
    try {
      const response = await apiClient.put(`/admin/problems/${id}/status`, { status, note, reason });
      return response.data;
    } catch (err) {
      const problems = JSON.parse(localStorage.getItem('cpt_mock_problems') || '[]');
      const index = problems.findIndex(p => p.id === id || p.ticket_id === id);
      if (index === -1) throw new Error('Problem not found.');

      const now = new Date().toISOString();
      problems[index].status = status;
      problems[index].updated_at = now;

      if (status === 'RESOLVED') {
        problems[index].resolution = {
          details: note || 'Issue resolved by administration maintenance team.',
          resolved_by: problems[index].assigned_department || 'Campus Administration',
          resolved_at: now
        };
      }

      problems[index].timeline.push({
        status: status,
        title: `Status set to ${status}`,
        timestamp: now,
        note: note || reason || `Status changed to ${status} by Admin.`
      });

      localStorage.setItem('cpt_mock_problems', JSON.stringify(problems));
      return { success: true, message: 'Status updated.', problem: problems[index] };
    }
  },

  // Feedback
  async submitFeedback(id, feedbackData) {
    try {
      const response = await apiClient.post(`/problems/${id}/feedback`, feedbackData);
      return response.data;
    } catch (err) {
      const problems = JSON.parse(localStorage.getItem('cpt_mock_problems') || '[]');
      const index = problems.findIndex(p => p.id === id || p.ticket_id === id);
      if (index === -1) throw new Error('Problem not found.');

      problems[index].feedback = {
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        submitted_at: new Date().toISOString()
      };
      
      localStorage.setItem('cpt_mock_problems', JSON.stringify(problems));
      return { success: true, message: 'Feedback submitted successfully.' };
    }
  },

  // Departments CRUD
  async getDepartments() {
    try {
      const response = await apiClient.get('/departments');
      return response.data;
    } catch (err) {
      const depts = JSON.parse(localStorage.getItem('cpt_mock_departments') || '[]');
      return { success: true, departments: depts };
    }
  },

  async createDepartment(deptData) {
    try {
      const response = await apiClient.post('/departments', deptData);
      return response.data;
    } catch (err) {
      const depts = JSON.parse(localStorage.getItem('cpt_mock_departments') || '[]');
      const newDept = {
        id: `dept_${Date.now()}`,
        name: deptData.name,
        code: deptData.code || deptData.name.toUpperCase().slice(0, 4),
        active_problems: 0,
        resolved_problems: 0,
        staff_count: 1
      };
      depts.push(newDept);
      localStorage.setItem('cpt_mock_departments', JSON.stringify(depts));
      return { success: true, department: newDept };
    }
  },

  // Staff CRUD
  async getStaff(departmentId = null) {
    try {
      const response = await apiClient.get('/staff', { params: { department_id: departmentId } });
      return response.data;
    } catch (err) {
      let staff = JSON.parse(localStorage.getItem('cpt_mock_staff') || '[]');
      if (departmentId) {
        staff = staff.filter(s => s.department_id === departmentId);
      }
      return { success: true, staff };
    }
  },

  async createStaff(staffData) {
    try {
      const response = await apiClient.post('/staff', staffData);
      return response.data;
    } catch (err) {
      const staffList = JSON.parse(localStorage.getItem('cpt_mock_staff') || '[]');
      const newStaff = {
        id: `stf_${Date.now()}`,
        name: staffData.name,
        staff_id: `STF-${Date.now().toString().slice(-4)}`,
        department_id: staffData.department_id,
        department_name: staffData.department_name || 'Maintenance',
        email: staffData.email,
        active_problems: 0,
        resolved_problems: 0,
        status: 'ACTIVE'
      };
      staffList.push(newStaff);
      localStorage.setItem('cpt_mock_staff', JSON.stringify(staffList));
      return { success: true, staff: newStaff };
    }
  },

  // Categories & Locations
  async getCategories() {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (err) {
      const categories = JSON.parse(localStorage.getItem('cpt_mock_categories') || '[]');
      return { success: true, categories };
    }
  },

  async createCategory(catData) {
    try {
      const response = await apiClient.post('/categories', catData);
      return response.data;
    } catch (err) {
      const categories = JSON.parse(localStorage.getItem('cpt_mock_categories') || '[]');
      const newCat = { id: `cat_${Date.now()}`, name: catData.name, code: catData.code || 'CAT', count: 0 };
      categories.push(newCat);
      localStorage.setItem('cpt_mock_categories', JSON.stringify(categories));
      return { success: true, category: newCat };
    }
  },

  async getLocations() {
    try {
      const response = await apiClient.get('/locations');
      return response.data;
    } catch (err) {
      const locations = JSON.parse(localStorage.getItem('cpt_mock_locations') || '[]');
      return { success: true, locations };
    }
  },

  async createLocation(locData) {
    try {
      const response = await apiClient.post('/locations', locData);
      return response.data;
    } catch (err) {
      const locations = JSON.parse(localStorage.getItem('cpt_mock_locations') || '[]');
      const newLoc = { id: `loc_${Date.now()}`, building: locData.building, floor: locData.floor, room: locData.room, problem_count: 0 };
      locations.push(newLoc);
      localStorage.setItem('cpt_mock_locations', JSON.stringify(locations));
      return { success: true, location: newLoc };
    }
  },

  // Analytics
  async getAdminAnalytics() {
    try {
      const response = await apiClient.get('/admin/analytics');
      return response.data;
    } catch (err) {
      const problems = JSON.parse(localStorage.getItem('cpt_mock_problems') || '[]');
      const statusCounts = {
        REPORTED: problems.filter(p => p.status === 'REPORTED').length,
        VERIFIED: problems.filter(p => p.status === 'VERIFIED').length,
        ASSIGNED: problems.filter(p => p.status === 'ASSIGNED').length,
        IN_PROGRESS: problems.filter(p => p.status === 'IN_PROGRESS').length,
        RESOLVED: problems.filter(p => p.status === 'RESOLVED').length,
        REJECTED: problems.filter(p => p.status === 'REJECTED').length
      };

      const priorityCounts = {
        CRITICAL: problems.filter(p => p.current_priority === 'CRITICAL').length,
        HIGH: problems.filter(p => p.current_priority === 'HIGH').length,
        MEDIUM: problems.filter(p => p.current_priority === 'MEDIUM').length,
        LOW: problems.filter(p => p.current_priority === 'LOW').length
      };

      return {
        success: true,
        total_problems: problems.length,
        status: statusCounts,
        priority: priorityCounts,
        avg_assignment_time: '3.5 Hours',
        avg_resolution_time: '24.2 Hours'
      };
    }
  },

  // Notifications
  async getNotifications() {
    try {
      const response = await apiClient.get('/notifications');
      return response.data;
    } catch (err) {
      const notifications = JSON.parse(localStorage.getItem('cpt_mock_notifications') || '[]');
      return { success: true, notifications };
    }
  },

  async getAdminNotifications() {
    try {
      const response = await apiClient.get('/admin/notifications');
      return response.data;
    } catch (err) {
      const notifs = JSON.parse(localStorage.getItem('cpt_mock_admin_notifications') || '[]');
      return { success: true, notifications: notifs };
    }
  },

  async markNotificationAsRead(id) {
    try {
      const response = await apiClient.put(`/notifications/${id}/read`);
      return response.data;
    } catch (err) {
      const notifs = JSON.parse(localStorage.getItem('cpt_mock_admin_notifications') || '[]');
      const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('cpt_mock_admin_notifications', JSON.stringify(updated));
      return { success: true };
    }
  }
};
