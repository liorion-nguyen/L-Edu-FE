import { Currency, Status, TypeDiscount } from "../enum/course.enum";
import { Role } from "../enum/user.enum";
import { SessionCoreResponse, SessionResponse } from "./session";
import { IntructorType, UserCoreType } from "./user";

export type CoursesState = {
    loading: boolean;
    errorMessage: string,
    courses: CourseType[] | null,
    course: CourseType | null,
    session: SessionResponse | null
    totalCourse: number;
    myCourses: MyCourseResponse[] | null;
};

export type Discount = {
    type: TypeDiscount;
    number: number;
};

export type Price = {
    currency: Currency;
    number: number;
};

export type CourseType = {
    _id: string;
    name: string;
    description: string;
    price: Price;
    discount?: Discount;
    instructorId?: string;
    category?: string;
    categoryId?: string;
    averageRating?: number;
    totalReviews?: number;
    cover?: string;
    students: string[];
    sessions?: SessionCoreResponse[] | string[];
    duration: number;
    status: Status;
    createdAt: string;
    updatedAt: string;
    instructor?: IntructorType | null;
    mode?: string;
};

export type MyCourseResponse = {
    _id: string;
    name: string;
    instructor: UserCoreType | null;
    duration: number;
    numberOfSessionCurrent: number;
    role: Role;
}

