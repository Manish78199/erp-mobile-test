export interface TimeSlot {
  id: string
  start_time: string
  end_time: string
  duration: number // in minutes
}

export interface Subject {
  id: string
  name: string
  code: string
  teacher: string
  color?: string
}

export interface TimetableEntry {
  sequence:number
  class_id: string
  section_id: string
  day: string 
  start_time: string
  end_time:string
  subject_id: string
  teacher_id: string
  room_no?: string
}


