// Initial Seed Mock Data for Campus Problem Tracker (User & Admin System)
// Strictly follows MongoDB schema and backend REST API specifications.

export const INITIAL_USER = {
  id: "usr_student_01",
  college_id: "CS24001",
  name: "Alex Morgan",
  email: "alex.morgan@campus.edu",
  department: "Computer Science & Engineering",
  role: "student",
  joined_date: "2024-08-15"
};

export const INITIAL_ADMIN = {
  id: "usr_admin_01",
  college_id: "ADMIN001",
  name: "Dr. Robert Vance",
  email: "admin.vance@campus.edu",
  department: "Campus Infrastructure & Maintenance",
  role: "admin",
  joined_date: "2022-01-10"
};

export const MOCK_DEPARTMENTS = [
  { id: "dept_it", name: "IT Network & Infrastructure Services", code: "IT", active_problems: 4, resolved_problems: 18, staff_count: 5 },
  { id: "dept_elec", name: "Electrical & Maintenance Dept", code: "ELECTRICAL", active_problems: 2, resolved_problems: 12, staff_count: 4 },
  { id: "dept_plumb", name: "Plumbing & Sanitation Dept", code: "PLUMBING", active_problems: 3, resolved_problems: 15, staff_count: 3 },
  { id: "dept_clean", name: "Housekeeping & Facilities", code: "CLEANING", active_problems: 1, resolved_problems: 22, staff_count: 6 },
  { id: "dept_infra", name: "Civil & Furniture Works", code: "INFRASTRUCTURE", active_problems: 2, resolved_problems: 9, staff_count: 4 },
  { id: "dept_av", name: "AV & Educational Technology", code: "AV_TECH", active_problems: 1, resolved_problems: 14, staff_count: 3 }
];

export const MOCK_STAFF = [
  { id: "stf_01", name: "Rahul Kumar", staff_id: "STF-IT-101", department_id: "dept_it", department_name: "IT Network & Infrastructure Services", email: "rahul.k@campus.edu", active_problems: 2, resolved_problems: 11, status: "ACTIVE" },
  { id: "stf_02", name: "Priya Sharma", staff_id: "STF-IT-102", department_id: "dept_it", department_name: "IT Network & Infrastructure Services", email: "priya.s@campus.edu", active_problems: 1, resolved_problems: 8, status: "ACTIVE" },
  { id: "stf_03", name: "Suresh Verma", staff_id: "STF-EL-201", department_id: "dept_elec", department_name: "Electrical & Maintenance Dept", email: "suresh.v@campus.edu", active_problems: 2, resolved_problems: 14, status: "ACTIVE" },
  { id: "stf_04", name: "Ramesh Naik", staff_id: "STF-PL-301", department_id: "dept_plumb", department_name: "Plumbing & Sanitation Dept", email: "ramesh.n@campus.edu", active_problems: 1, resolved_problems: 10, status: "ACTIVE" },
  { id: "stf_05", name: "Anita Roy", staff_id: "STF-AV-401", department_id: "dept_av", department_name: "AV & Educational Technology", email: "anita.r@campus.edu", active_problems: 0, resolved_problems: 9, status: "ACTIVE" }
];

export const MOCK_CATEGORIES = [
  { id: "cat_it", name: "IT & Wi-Fi", code: "IT", count: 12 },
  { id: "cat_elec", name: "Electrical", code: "ELECTRICAL", count: 8 },
  { id: "cat_plumb", name: "Plumbing & Water", code: "PLUMBING", count: 9 },
  { id: "cat_clean", name: "Housekeeping & Cleaning", code: "CLEANING", count: 6 },
  { id: "cat_infra", name: "Infrastructure & Furniture", code: "INFRASTRUCTURE", count: 7 },
  { id: "cat_hostel", name: "Hostel Facilities", code: "HOSTEL", count: 5 },
  { id: "cat_lib", name: "Library", code: "LIBRARY", count: 3 },
  { id: "cat_lab", name: "Laboratory Equipment", code: "LABORATORY", count: 4 },
  { id: "cat_sec", name: "Campus Security", code: "SECURITY", count: 2 },
  { id: "cat_trans", name: "Transport & Parking", code: "TRANSPORT", count: 3 },
  { id: "cat_other", name: "Other Campus Issue", code: "OTHER", count: 2 }
];

export const MOCK_LOCATIONS = [
  { id: "loc_block_c", building: "Block C - Academic Building", floor: "2nd Floor", room: "Room C204", problem_count: 5 },
  { id: "loc_library", building: "Central Library", floor: "1st Floor", room: "Reading Room B", problem_count: 3 },
  { id: "loc_hostel_a", building: "Boys Hostel Block A", floor: "Ground Floor", room: "Dining Hall", problem_count: 4 },
  { id: "loc_lab_building", building: "Science & Tech Lab Complex", floor: "3rd Floor", room: "Electronics Lab 3", problem_count: 6 },
  { id: "loc_sports", building: "Sports Complex", floor: "Ground Floor", room: "Indoor Gymnasium", problem_count: 2 }
];

export const INITIAL_PROBLEMS = [
  {
    id: "prob_001",
    ticket_id: "CPT-2026-0001",
    title: "High-speed Wi-Fi network connection unavailable in Block C 2nd Floor",
    description: "Students and faculty are unable to connect to the campus Wi-Fi network 'Campus-Fast-5G'. Signal drops frequently and authentication fails repeatedly.",
    category_id: "cat_it",
    category_name: "IT & Wi-Fi",
    reporter_id: "CS24001",
    reporter_name: "Alex Morgan",
    location: {
      building: "Block C - Academic Building",
      floor: "2nd Floor",
      room: "Room C204 / Hallway"
    },
    user_priority: "HIGH",
    current_priority: "CRITICAL",
    status: "IN_PROGRESS",
    image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-09-28T09:30:00Z",
    updated_at: "2026-09-29T14:15:00Z",
    assigned_department_id: "dept_it",
    assigned_department: "IT Network & Infrastructure Services",
    assigned_staff_id: "stf_01",
    assigned_staff_name: "Rahul Kumar",
    timeline: [
      { status: "REPORTED", title: "Problem Reported", timestamp: "2026-09-28T09:30:00Z", note: "Ticket successfully logged by student CS24001." },
      { status: "VERIFIED", title: "Problem Verified", timestamp: "2026-09-28T11:45:00Z", note: "Verified by Campus Helpdesk Admin." },
      { status: "ASSIGNED", title: "Assigned to Department", timestamp: "2026-09-29T08:20:00Z", note: "Assigned to IT Network Engineering Team (Rahul Kumar)." },
      { status: "IN_PROGRESS", title: "Work In Progress", timestamp: "2026-09-29T14:15:00Z", note: "Replacing corrupted network switch on Block C 2nd Floor." }
    ]
  },
  {
    id: "prob_002",
    ticket_id: "CPT-2026-0002",
    title: "Classroom C-102 Projector HDMI Port Damage",
    description: "The ceiling projector in classroom C-102 displays distorted red lines. The HDMI input cable socket is physically damaged and loose.",
    category_id: "cat_infra",
    category_name: "Infrastructure & Furniture",
    reporter_id: "CS24001",
    reporter_name: "Alex Morgan",
    location: {
      building: "Block C - Academic Building",
      floor: "1st Floor",
      room: "Classroom C-102"
    },
    user_priority: "MEDIUM",
    current_priority: "MEDIUM",
    status: "RESOLVED",
    image_url: null,
    created_at: "2026-09-25T11:20:00Z",
    updated_at: "2026-09-27T16:45:00Z",
    assigned_department_id: "dept_av",
    assigned_department: "AV & Educational Technology Maintenance",
    assigned_staff_id: "stf_05",
    assigned_staff_name: "Anita Roy",
    timeline: [
      { status: "REPORTED", title: "Problem Reported", timestamp: "2026-09-25T11:20:00Z", note: "Ticket submitted with details." },
      { status: "VERIFIED", title: "Problem Verified", timestamp: "2026-09-25T14:00:00Z", note: "Inspected by AV Technician." },
      { status: "ASSIGNED", title: "Assigned to AV Team", timestamp: "2026-09-26T09:10:00Z", note: "Work order created for cable replacement." },
      { status: "IN_PROGRESS", title: "Work In Progress", timestamp: "2026-09-26T13:30:00Z", note: "Installing new HDMI adapter box." },
      { status: "RESOLVED", title: "Problem Resolved", timestamp: "2026-09-27T16:45:00Z", note: "HDMI wall plate installed and tested with laptop display." }
    ],
    resolution: {
      details: "Replaced the damaged HDMI cable connection with a new high-speed ceiling connector box and tested audio/video output.",
      resolved_by: "AV Maintenance Department (Anita Roy)",
      resolved_at: "2026-09-27T16:45:00Z"
    },
    feedback: {
      rating: 5,
      comment: "Prompt resolution before Monday morning lectures! Great work.",
      submitted_at: "2026-09-28T08:00:00Z"
    }
  },
  {
    id: "prob_003",
    ticket_id: "CPT-2026-0003",
    title: "Water leakage in Boys Hostel Block A Restroom 3",
    description: "Continuous water dripping from overhead pipe near Washbasin 2 causing water accumulation on the floor.",
    category_id: "cat_plumb",
    category_name: "Plumbing & Water",
    reporter_id: "CS24001",
    reporter_name: "Alex Morgan",
    location: {
      building: "Boys Hostel Block A",
      floor: "2nd Floor",
      room: "Restroom Wing B"
    },
    user_priority: "CRITICAL",
    current_priority: "CRITICAL",
    status: "REPORTED",
    image_url: null,
    created_at: "2026-10-01T08:00:00Z",
    updated_at: "2026-10-01T08:00:00Z",
    assigned_department_id: null,
    assigned_department: null,
    timeline: [
      { status: "REPORTED", title: "Problem Reported", timestamp: "2026-10-01T08:00:00Z", note: "Ticket created and queued for verification." }
    ]
  },
  {
    id: "prob_004",
    ticket_id: "CPT-2026-0004",
    title: "Main Electrical Board Fuse Tripping in Electronics Lab 3",
    description: "Main circuit breaker trips whenever 5 or more Oscilloscope stations are powered simultaneously.",
    category_id: "cat_elec",
    category_name: "Electrical",
    reporter_id: "EC24088",
    reporter_name: "David Chen",
    location: {
      building: "Science & Tech Lab Complex",
      floor: "3rd Floor",
      room: "Electronics Lab 3"
    },
    user_priority: "HIGH",
    current_priority: "HIGH",
    status: "ASSIGNED",
    image_url: null,
    created_at: "2026-09-30T10:15:00Z",
    updated_at: "2026-09-30T15:30:00Z",
    assigned_department_id: "dept_elec",
    assigned_department: "Electrical & Maintenance Dept",
    assigned_staff_id: "stf_03",
    assigned_staff_name: "Suresh Verma",
    timeline: [
      { status: "REPORTED", title: "Problem Reported", timestamp: "2026-09-30T10:15:00Z", note: "Ticket submitted by faculty member." },
      { status: "VERIFIED", title: "Problem Verified", timestamp: "2026-09-30T12:00:00Z", note: "Electrical load verified by Lab Superintendent." },
      { status: "ASSIGNED", title: "Assigned to Electrical Dept", timestamp: "2026-09-30T15:30:00Z", note: "Assigned to Suresh Verma for breaker capacity upgrade." }
    ]
  }
];

export const INITIAL_ADMIN_NOTIFICATIONS = [
  {
    id: "anotif_001",
    ticket_id: "CPT-2026-0003",
    problem_id: "prob_003",
    title: "Critical Issue Reported",
    message: "A CRITICAL water leakage problem in Boys Hostel Block A requires immediate admin verification.",
    type: "critical_alert",
    read: false,
    created_at: "2026-10-01T08:00:00Z"
  },
  {
    id: "anotif_002",
    ticket_id: "CPT-2026-0002",
    problem_id: "prob_002",
    title: "5-Star Feedback Received",
    message: "Student CS24001 submitted 5-star positive feedback for resolved ticket CPT-2026-0002.",
    type: "feedback",
    read: true,
    created_at: "2026-09-28T08:00:00Z"
  }
];
