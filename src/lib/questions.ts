export interface Question {
  question: string;
  resultType: string;
  choices?: string[];
}

export interface ExamContent {
  name: string;
  language: string;
  content: Question[];
}

export async function getExamQuestions(examId: string): Promise<ExamContent> {
  try {
    const examData: ExamContent = await import(`@/docs/${examId}.json`);
    return {
      ...examData,
      content: examData.content.filter(
        (q: Question) => ["MULTICHOICE_MANY", "MULTICHOICE_SINGLE"].includes(q.resultType)
      ),
    };
  } catch (error) {
    console.error(`Error loading questions for exam ${examId}:`, error);
    return { name: "", language: "", content: [] };
  }
}

export async function getExamProblemQuestions(examId: string): Promise<ExamContent> {
  try {
    const examData: ExamContent = await import(`@/docs/${examId}.json`);
    return {
      ...examData,
      content: examData.content.filter(
        (q: Question) => ["SQL", "FUNCTION", "EXPRESSION"].includes(q.resultType)
      ),
    };
  } catch (error) {
    console.error(`Error loading problem questions for exam ${examId}:`, error);
    return { name: "", language: "", content: [] };
  }
}
