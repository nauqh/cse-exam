export interface Question {
  question: string;
  resultType: string;
  choices?: string[];
}

export async function getExamQuestions(examId: string): Promise<Question[]> {
  try {
    const questionsData = await import(`@/docs/${examId}.json`);
    const multichoiceQuestions = questionsData.default.filter(
      (q: Question) => ["MULTICHOICE_MANY","MULTICHOICE_SINGLE"].includes(q.resultType)
    );
    return multichoiceQuestions;
  } catch (error) {
    console.error(`Error loading questions for exam ${examId}:`, error);
    return [];
  }
}

export async function getExamProblemQuestions(examId: string): Promise<Question[]> {
  try {
    const questionsData = await import(`@/docs/${examId}.json`);
    const multichoiceQuestions = questionsData.default.filter(
      (q: Question) => ["SQL", "FUNCTION", "EXPRESSION"].includes(q.resultType)
    );
    return multichoiceQuestions;
  } catch (error) {
    console.error(`Error loading questions for exam ${examId}:`, error);
    return [];
  }
}
