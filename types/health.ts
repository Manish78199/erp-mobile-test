export interface HealthProfile {
  height: number
  weight: number
  bmi: number
  bloodGroup: string
  lastCheckup: string
  allergies: string[]
  medications: string[]
  emergencyContact: string
}

export interface HealthVital {
  name: string
  value: string
  unit: string
  status: string
  icon: string
  color: string
}

export interface HealthRecord {
  id: number
  date: string
  type: string
  title: string
  doctor: string
  notes: string
  status: string
}

export interface HealthAppointment {
  id: number
  date: string
  time: string
  doctor: string
  type: string
  status: string
}

export interface HealthSymptom {
  name: string
  severity: string
  frequency: string
  lastReported: string
}

export interface HealthChartData {
  month: string
  height: number
  weight: number
  bmi: number
}

export interface HealthData {
  current: HealthProfile
  chart: HealthChartData[]
  vitals: HealthVital[]
  records: HealthRecord[]
  appointments: HealthAppointment[]
  symptoms: HealthSymptom[]
}
