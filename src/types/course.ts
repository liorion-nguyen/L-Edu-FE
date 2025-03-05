export type CourseType = {
    id: string,
    title: string,
    description: string,
    language: string[],
    thumbnail: string,
    teacher: {
        id: string,
        name: string,
        avatar: string
    },
    price: number,
    discount: number,
    status: string,
    countLesson: number,
    knowledge?: KnowledgeType[],
    students?: string[]
}

export type KnowledgeType = {
    id: string,
    title: string,
    content: string,
    status: string,
    video: string,
    quiz: string
}

export type CoursesState = {
    loading: boolean;
    errorMessage: string;
    courses: CourseType[] | null;
    course: CourseType | null;
};