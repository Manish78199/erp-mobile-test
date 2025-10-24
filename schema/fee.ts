import * as yup from 'yup';

const FeeDepositSchema = yup.object().shape({
    student_id:yup.string().required("Please select student."),
    paid_amount:yup.number().min(1).required("Please enter a valid amount."),
    payment_mode: yup.mixed().oneOf(["CASH", "UPI", "CARD","BANK_TRANSFER","OTHER"]).required("Please choose payment mode."),
    remarks: yup.string().nullable(),
    reference_no:yup.string().nullable()
});

export { FeeDepositSchema };
