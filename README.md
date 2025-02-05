# Devlog

## Day 1: Implement Problem Submit Code Page

- **Objective**: Divide the page into two sections: left for problem description, right for code submission.
- **Tasks**:
  - Create a layout with two sections.
  - Implement a code editor at the top of the right section.
  - Add an output area below the code editor.
- **Relevant Code**:
  - The layout and sections can be implemented in [src/app/exams/[examId]/problem/[id]/page.tsx](src/app/exams/[examId]/problem/[id]/page.tsx).
  - Use components like `CodeEditor` and `OutputArea` from [src/components/ui](src/components/ui).

## Day 2: Build Code Interpreter

- **Objective**: Build a code interpreter server that processes user-submitted code and returns the output.
- **Tasks**:
  - Set up a server to handle code submissions.
  - Implement code execution and return the output.
  - Format traceback errors for better readability.
- **Relevant Code**:
  - The server implementation can be found in [src/server/codeInterpreter.ts](src/server/codeInterpreter.ts).
  - Use the `executeCode` function to handle code execution and error formatting.

## Day 3: Implement Multichoice Page

- **Objective**: Create a multichoice page for exams.
- **Tasks**:
  - Design the layout for the multichoice questions.
  - Implement the logic to fetch and display questions.
  - Handle user selections and submissions.
- **Relevant Code**:
  - The multichoice page implementation is in [src/app/exams/[examId]/multichoice/[id]/page.tsx](src/app/exams/[examId]/multichoice/[id]/page.tsx).
  - Use components like `RadioGroup` and `Button` from [src/components/ui](src/components/ui).

## Day 4: Implement Main Page

- **Objective**: Create the main page for the application.
- **Tasks**:
  - Design the main page layout.
  - Add navigation links to different sections of the application.
  - Display a list of available exams.
- **Relevant Code**:
  - The main page implementation is in [src/app/page.tsx](src/app/page.tsx).
  - Use components like `Link` and `Button` from [src/components/ui](src/components/ui).

## Day 5: Build Routing

- **Objective**: Set up routing for the application.
- **Tasks**:
  - Define routes for different pages (e.g., main page, problem page, multichoice page).
  - Move multichoice/ and problem/ to exams/
  - Implement navigation logic.
  - Ensure smooth transitions between pages.
- **Relevant Code**:
  - Routing configuration can be found in [next.config.ts](next.config.ts).
  - Use the `usePathname` and `useRouter` hooks from `next/navigation` for navigation logic.
