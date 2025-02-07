export const statusFilters = [
    { status: "completed", label: "Completed" },
    { status: "failed", label: "Failed" },
    { status: "marking", label: "Marking" },
    { status: "incomplete", label: "Incomplete" },
] as const;

export type MultiChoiceAnswer = {
  question: string;
  answer: string;
};

export type ProblemAnswer = {
  code: string;
  language: string;
};

export type ExamResults = {
  email: string;
  exam_id: string;
  exam_name: string;
  answers: Array<{
    answer: string;
    type: string;
  }>;
};


