import * as yup from 'yup';

const GenderEnum = yup.string().oneOf(["MALE", "FEMALE", "OTHER"], "Invalid gender");

const PersonalDetailsSchema = yup.object().shape({
  profileImage:yup.string().required("Please upload profile photo."),
  first_name: yup.string().min(3).required("First name is required"),
  middle_name: yup.string().nullable(),
  last_name: yup.string(),
  date_of_birth: yup.date().required("Date of birth is required"),
  gender: GenderEnum.required("Gender is required"),
  blood_group: yup.string().nullable(),
  nationality: yup.string().required("Nationality is required"),
  religion: yup.string().nullable(),
  category: yup.string().nullable(),
  aadhar_number: yup.string().nullable(),
});

const ContactDetailsSchema = yup.object().shape({
  phone_number: yup.string().required("Phone number is required"),
  alternate_phone_number: yup.string().nullable(),
  email_address: yup.string().email("Invalid email").required("Email address is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  permanent_address: yup.string().required("Permanent address is required"),
});

const ParentGuardianDetailsSchema = yup.object().shape({
  father_name: yup.string().required("Father's name is required"),
  mother_name: yup.string().nullable(),
  guardian_name: yup.string().nullable(),
  father_occupation: yup.string().nullable(),
  mother_occupation: yup.string().nullable(),
  guardian_occupation: yup.string().nullable(),
  father_phone_number: yup.string().required("Father's phone number is required"),
  mother_phone_number: yup.string().nullable(),
  guardian_phone_number: yup.string().nullable(),
});

const CourseDetailsSchema = yup.object().shape({
  student_class: yup.string().required("Class is required"),
  // academic_year: yup.string().required("Academic year is required"),
  class_language: yup.string().nullable(),
  stream: yup.string().default("N/A"),
  optional_subjects: yup.string().nullable(),
});

const FeeDetailsSchema = yup.object().shape({
  tuition_fee: yup.number().required("Tuition fee is required"),
  transport_fee: yup.number().default(0),
  lab_fee: yup.number().default(0),
  total_fee: yup.number().required("Total fee is required"),
  fee_paid: yup.number().min(0).required("Fee paid is required"),
  remaining_fee: yup.number().required("Remaining fee is required"),
});

const DocumentsSchema = yup.object().shape({
  birth_certificate: yup.string().nullable(),
  address_proof: yup.string().nullable(),
  report_card: yup.string().nullable(),
  passport_photo: yup.string().nullable(),
  transfer_certificate: yup.string().nullable(),
});

const StudentRegistrationSchema = yup.object().shape({
  personal_details: PersonalDetailsSchema.required("Personal details are required"),
  contact_details: ContactDetailsSchema.required("Contact details are required"),
  parent_guardian_details: ParentGuardianDetailsSchema.required("Parent/Guardian details are required"),
  course_details: CourseDetailsSchema.required("Course details are required"),
  fee_details: FeeDetailsSchema.required("Fee details are required"),
  documents: DocumentsSchema.required("Documents are required")
  
});







interface EducationQualification {
  name: string
  institute_name: string
  institute_address: string
  percentage: number
  year: string
  obtain_marks: number
  max_marks: number
}

interface AdmissionFormValues {
  personal_details: {
    profileImage:string
    first_name: string
    middle_name: string
    last_name: string
    date_of_birth: string
    gender: string
    blood_group: string
    nationality: string
    religion: string
    category: string
    aadhar_number: string
  }
  contact_details: {
    phone_number: string
    alternate_phone_number: string
    email_address: string
    country: string
    state: string
    city: string
    address: string
    permanent_address: string
  }
  parent_guardian_details: {
    father_name: string
    mother_name: string
    guardian_name: string
    father_occupation: string
    mother_occupation: string
    guardian_occupation: string
    father_phone_number: string
    mother_phone_number: string
    guardian_phone_number: string
  }
  education_qualifications: EducationQualification[]
  course_details: {
    student_class: string
    class_language: string
    stream: string
    optional_subjects: string
  }
  fee_details: {
    tuition_fee: number
    transport_fee: number
    lab_fee: number
    total_fee: number
    fee_paid: number
    remaining_fee: number
  }
  documents: {
    birth_certificate: File | null
    address_proof: File | null
    report_card: File | null
    passport_photo: File | null
    transfer_certificate: File | null
  }
}









export type {
  EducationQualification,
  AdmissionFormValues
}
export default StudentRegistrationSchema;
