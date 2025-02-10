import { SubmissionStatus } from "@/components/exam/ExamCard";

export interface StatusFilter {
  status: SubmissionStatus;
  label: string;
}

export const statusFilters: StatusFilter[] = [
  { status: "completed", label: "Completed" },
  { status: "incompleted", label: "Incompleted" },
  { status: "failed", label: "Failed" },
  { status: "marking", label: "Marking" },
];

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


