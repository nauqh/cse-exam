import { readFile } from 'fs/promises';
import { join } from 'path';

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

async function getExamDataFromFile(examId: string): Promise<ExamContent> {
  try {
    const filePath = join(process.cwd(), 'src', 'docs', `${examId}.json`);
    const fileContent = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as ExamContent;
  } catch (error) {
    console.error(`Error reading exam ${examId} from file:`, error);
    return { name: "", language: "", content: [] };
  }
}

export async function getExamQuestions(examId: string): Promise<ExamContent> {
  try {
    const examData = await getExamDataFromFile(examId);
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
    const examData = await getExamDataFromFile(examId);
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
