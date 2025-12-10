
export interface Stats {
  users: number
  resumes: number
  revenue: number
  status_breakdown: Record<string, number>
}

export interface User {
  id: number
  email: string
  is_active: boolean
  is_superuser: boolean
  credits: number
  created_at: string | null
  resume_count: number
}

export interface Resume {
  id: number
  user_id: number
  user_email: string
  original_filename: string
  status: string
  score: number | null
  created_at: string | null
}
