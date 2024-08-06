import mongoose, { Schema, Document } from "mongoose";


export interface Mark extends Document {
    studentId: string,
    attendence: number,
    projectReview: number,
    assessment: number,
    projectSubmission: number,
    linkedIn: number

}

const markSchema: Schema<Mark> = new Schema({
    studentId: {
        type: String,
        trim: true,
        required: [true, "Student Id is required"],
        unique: true
    },
    attendence: {
        type: Number
    },
    projectReview: {
        type: Number
    },
    assessment: {
        type: Number
    },
    projectSubmission: {
        type: Number
    },
    linkedIn: {
        type: Number
    }



}, { timestamps: true })

const MarkModel =
    (mongoose.models.Mark as mongoose.Model<Mark>) ||
    mongoose.model<Mark>('User', markSchema);

export default MarkModel;