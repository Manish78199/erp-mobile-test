import * as Yup from 'yup';

export type employeeFormikType = {
  name: string,
  email: string,
  phone: string,
  father_name: string,
  mother_name: string,
  date_of_birth: string,
  address: string,
  gender: string,
  designation: string,
  joining_date: string,
  // profileImage: string,
  // status: string,
  marital_status: string,

  leaves: {
    mediacal_leaves: number,
    casual_leaves: number,
    maternity_leaves: number,
    sick_leaves: number,

  },

  bank_details: {
    account_type: string,
    account_no: string,
    bank_name: string,
    ifsc_code: string,
    branch_name: string,

  },

  userId: string,
  password: string,

  experience: Array<{
    organization: string,
    designation: string,
    address: string,
    start_date: string,
    end_date: string
  } >,

  education: Array<{
    institution: string,
    roll_no: string,
    degree: string,
    institiion_address: string,
    start_date: string,
    end_date: string,
  } >|[],
}










export const employeeValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  father_name: Yup.string(),
  mother_name: Yup.string(),
  date_of_birth: Yup.date().required('Date of birth is required'),
  address: Yup.string(),
  gender: Yup.mixed().oneOf(['FEMALE', 'MALE', 'OTHER']).required('Gender is required'),
  designation: Yup.string(),
  joining_date: Yup.date().required('Joining date is required'),
  profileImage: Yup.string(),
  status: Yup.mixed().oneOf(['ACTIVE', 'INACTIVE']).nullable(),
  marital_status: Yup.mixed().oneOf(['SINGLE', 'MARRIED', 'OTHER']).required(),

  leaves: Yup.object().shape({
    mediacal_leaves: Yup.number().required('Medical leaves are required'),
    casual_leaves: Yup.number().required('Casual leaves are required'),
    maternity_leaves: Yup.number().required('Maternity leaves are required'),
    sick_leaves: Yup.number().required('Sick leaves are required'),

  }).required(),

  bank_details: Yup.object().shape({
    account_type: Yup.string().required('Account type is required'),
    account_no: Yup.string().required('Account number is required'),
    bank_name: Yup.string().required('Bank name is required'),
    ifsc_code: Yup.string().required('IFSC code is required'),
    branch_name: Yup.string().required('Branch name is required'),

  }).required(),

  userId: Yup.string().required('User ID is required'),
  password: Yup.string().required('Password is required'),

  experience: Yup.array().of(
    Yup.object().shape({
      organization: Yup.string().min(2).max(200).required('Organization is required'),
      designation: Yup.string().min(2).max(100).required('Designation is required'),
      address: Yup.string().min(5).max(300).required('Address is required'),
      start_date: Yup.date().required('Start date is required'),
      end_date: Yup.date().nullable(),
    })
  ),

  education: Yup.array().of(
    Yup.object().shape({
      institution: Yup.string().min(2).max(200).required('Institution is required'),
      roll_no: Yup.string().optional().nullable(),
      degree: Yup.string().min(2).max(100).required('Degree is required'),
      institiion_address: Yup.string(),
      start_date: Yup.date().required('Start date is required'),
      end_date: Yup.date().nullable(),
    })
  ),
});
