export type SessionCoreResponse = {
    _id: string;
    sessionNumber: number;
    title: string;
    views: number;
    modeNoteMd: string;
    modeVideoUrl: string;
    modeQuizId: string;
}

export type initialValuesType = {
    courseId: string;
    sessionNumber: number;
    title: string;
    quizId: string;
    modeQuizId: string;
    videoUrl: string;
    modeVideoUrl: string;
    notesMd: string;
    modeNoteMd: string;
    mode?: string;
};

export type SessionResponse = {
    _id: string;
    courseId: string;
    sessionNumber: number;
    title: string;
    quizId?: {
        quizId: string;
        mode: string;
    };
    videoUrl?: {
        videoUrl: string;
        mode: string;
    };
    notesMd?: {
        notesMd: string;
        mode: string;
    };
    views: number;
    mode?: string;
    createdAt?: string;
    updatedAt?: string;
}