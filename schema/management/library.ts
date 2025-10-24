import * as Yup from 'yup';



const CreateBookSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  author: Yup.string().required("Author is required"),
  isbn: Yup.string()
    .matches(/^[0-9\-]*$/, "Invalid ISBN format")
    .nullable(),
  edition: Yup.string().nullable(),
  publisher: Yup.string().nullable(),
  publication_year: Yup.number()
    .typeError("Publication Year must be a number")
    .min(1000, "Invalid Year")
    .max(new Date().getFullYear() + 1, "Invalid Year")
    .nullable(),
  category: Yup.string().required("Please select a category"),
  language: Yup.string().required("Please select a language"),
  total_copies: Yup.number()
    .typeError("Total Copies must be a number")
    .integer("Total Copies must be an integer")
    .min(1, "At least 1 copy is required")
    .required("Total Copies is required"),
  shelf_location: Yup.string().nullable(),
  description: Yup.string().nullable(),
});

export {
    CreateBookSchema
}