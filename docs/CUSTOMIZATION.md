# CSE Exam System: Customization Guide

This guide provides information on how to customize and extend the CSE Exam System for specific educational needs and requirements.

## Table of Contents

- [Overview](#overview)
- [Frontend Customization](#frontend-customization)
  - [Theming](#theming)
  - [Adding New Pages](#adding-new-pages)
  - [Modifying Components](#modifying-components)
- [Backend Customization](#backend-customization)
  - [Adding New API Endpoints](#adding-new-api-endpoints)
  - [Creating Custom Validation Logic](#creating-custom-validation-logic)
  - [Extending the Autograder](#extending-the-autograder)
- [Exam Content Customization](#exam-content-customization)
  - [Creating Custom Question Types](#creating-custom-question-types)
  - [Customizing Grading Logic](#customizing-grading-logic)
  - [Adding New Programming Languages](#adding-new-programming-languages)
- [Integration with External Systems](#integration-with-external-systems)
  - [LMS Integration](#lms-integration)
  - [Authentication Providers](#authentication-providers)
  - [Notification Systems](#notification-systems)
- [Advanced Customizations](#advanced-customizations)

## Overview

The CSE Exam System is designed to be flexible and extensible, allowing educational institutions to tailor the platform to their specific needs. This guide outlines the key areas where customization is supported and provides examples for common scenarios.

## Frontend Customization

### Theming

The frontend uses Tailwind CSS for styling, making it easy to customize the visual appearance of the application.

#### Customizing Colors

1. Modify the `tailwind.config.ts` file to update the color palette:

```typescript
const colors = {
  primary: {
    DEFAULT: '#1d283a',
    foreground: '#ffffff',
  },
  // Add your custom colors
};

export default {
  theme: {
    extend: {
      colors: colors,
    },
  },
  // Other configurations
}
```

2. Apply the colors in your components:

```jsx
<Button className="bg-primary hover:bg-primary/90">Submit</Button>
```

#### Custom Fonts

1. Add your custom fonts to the `public/fonts` directory
2. Update the `globals.css` file to include the font definitions:

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/CustomFont.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

/* Use in Tailwind config */
```

3. Add the font to your Tailwind configuration:

```typescript
const fontFamily = {
  sans: ['CustomFont', 'system-ui', 'sans-serif'],
  // Other font families
};
```

### Adding New Pages

The application uses Next.js App Router, making it easy to add new pages:

1. Create a new page in the appropriate directory within `src/app/`:

```jsx
// src/app/new-feature/page.tsx
export default function NewFeaturePage() {
  return (
    <div className="container mx-auto">
      <h1>New Feature</h1>
      <p>This is a new feature page.</p>
    </div>
  );
}
```

2. Add navigation links to the new page:

```jsx
// src/components/Navigation.tsx
<Link href="/new-feature">
  <Button variant="ghost">New Feature</Button>
</Link>
```

### Modifying Components

To customize existing components:

1. Create a custom version of the component:

```jsx
// src/components/custom/CustomButton.tsx
import { Button } from "@/components/ui/button";

export function CustomButton({ children, ...props }) {
  return (
    <Button 
      className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white"
      {...props}
    >
      {children}
    </Button>
  );
}
```

2. Use your custom component in place of the original:

```jsx
import { CustomButton } from "@/components/custom/CustomButton";

export default function MyPage() {
  return (
    <CustomButton>Custom Styled Button</CustomButton>
  );
}
```

## Backend Customization

### Adding New API Endpoints

To add new API endpoints to the FastAPI backend:

1. Create a new router file in the `app/routers` directory:

```python
# app/routers/analytics.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/performance/{exam_id}")
async def get_exam_performance(exam_id: str, db: Session = Depends(get_db)):
    """Get performance analytics for a specific exam."""
    # Implementation logic
    return {"exam_id": exam_id, "average_score": 85.5, "completion_rate": 0.78}
```

2. Register the router in the main FastAPI app:

```python
# app/main.py
from .routers import exams, submissions, analytics

app.include_router(exams.router)
app.include_router(submissions.router)
app.include_router(analytics.router)  # Add the new router
```

### Creating Custom Validation Logic

To add custom validation logic for different question types:

1. Create a new validation module:

```python
# app/csautograde/validators/graph_validator.py
class GraphValidator:
    """Validator for graph-based problems."""
    
    def __init__(self, expected_graph, student_graph):
        self.expected_graph = expected_graph
        self.student_graph = student_graph
        
    def validate(self):
        """Validate if the student's graph matches the expected graph."""
        # Implementation logic
        return {
            "is_valid": True,
            "score": 10,
            "feedback": "Your graph implementation is correct."
        }
```

2. Integrate the validator with the autograder:

```python
# app/csautograde/autograder.py
from .validators.graph_validator import GraphValidator

# Add to existing autograder logic
if question_type == "graph":
    validator = GraphValidator(expected_graph, student_graph)
    result = validator.validate()
```

### Extending the Autograder

To extend the autograder with new capabilities:

1. Add new grading methods to the Autograder class:

```python
# app/csautograde/autograder.py
class Autograder:
    # Existing methods...
    
    def grade_image_processing(self, submission, reference):
        """Grade image processing problems."""
        # Implementation logic
        similarity_score = self._calculate_image_similarity(submission, reference)
        return {
            "score": similarity_score * 10,
            "feedback": f"Your image processing solution has {similarity_score:.2f} similarity."
        }
        
    def _calculate_image_similarity(self, img1, img2):
        """Calculate similarity between two images."""
        # Implementation logic
        return 0.95  # Similarity score between 0 and 1
```

## Exam Content Customization

### Creating Custom Question Types

To create a new question type:

1. Define the question format in your exam JSON:

```json
{
  "type": "data_visualization",
  "id": "viz1",
  "question": "Create a bar chart showing the sales by region.",
  "dataset": "sales_data.csv",
  "requirements": [
    "Use matplotlib or seaborn",
    "Include proper axis labels",
    "Use a color palette that highlights the top region"
  ],
  "starter_code": "import matplotlib.pyplot as plt\nimport pandas as pd\n\ndef create_visualization(data):\n    # Your code here\n    pass",
  "points": 20
}
```

2. Create a corresponding UI component:

```jsx
// src/components/problem/DataVisualizationProblem.tsx
export default function DataVisualizationProblem({ problem, onSubmit }) {
  // Implementation
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{problem.question}</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Requirements:</h4>
        <ul className="list-disc pl-5">
          {problem.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
      {/* Code editor and visualization preview */}
    </div>
  );
}
```

3. Register the component in the problem renderer:

```jsx
// src/components/problem/ProblemRenderer.tsx
import DataVisualizationProblem from './DataVisualizationProblem';

export default function ProblemRenderer({ problem, onSubmit }) {
  switch (problem.type) {
    case 'multiple_choice':
      return <MultipleChoiceProblem problem={problem} onSubmit={onSubmit} />;
    case 'python':
      return <PythonProblem problem={problem} onSubmit={onSubmit} />;
    case 'sql':
      return <SQLProblem problem={problem} onSubmit={onSubmit} />;
    case 'data_visualization':
      return <DataVisualizationProblem problem={problem} onSubmit={onSubmit} />;
    default:
      return <div>Unsupported problem type: {problem.type}</div>;
  }
}
```

### Customizing Grading Logic

To customize the grading logic for existing question types:

1. Extend or modify the grading functions in the autograder:

```python
# app/csautograde/autograder.py
def grade_python_submission(self, student_code, test_cases, code_quality=True):
    """Enhanced Python grading with code quality checks."""
    score = 0
    max_score = len(test_cases) * 10
    
    # Run test cases
    test_results = self._run_test_cases(student_code, test_cases)
    score += sum(10 for result in test_results if result.passed)
    
    # Code quality check (optional)
    if code_quality:
        quality_score = self._check_code_quality(student_code)
        max_score += 10
        score += quality_score
    
    return {
        "score": score,
        "max_score": max_score,
        "details": test_results
    }

def _check_code_quality(self, code):
    """Check code quality using static analysis."""
    # Implementation using tools like pylint
    return 8  # Score out of 10 for code quality
```

### Adding New Programming Languages

To support a new programming language:

1. Add language support to the code execution engine:

```python
# app/csautograde/utils.py
def execute_code(code, language):
    """Execute code in different languages."""
    if language == "python":
        return execute_python_code(code)
    elif language == "javascript":
        return execute_javascript_code(code)
    elif language == "java":
        return execute_java_code(code)
    else:
        raise ValueError(f"Unsupported language: {language}")

def execute_javascript_code(code):
    """Execute JavaScript code using Node.js."""
    # Implementation
    return {"success": True, "output": "JavaScript output"}

def execute_java_code(code):
    """Execute Java code."""
    # Implementation
    return {"success": True, "output": "Java output"}
```

2. Update the frontend to support the new language:

```jsx
// Add CodeMirror language support
import { java } from '@codemirror/lang-java';

// Update language selector
const languageOptions = [
  { value: "python", label: "Python" },
  { value: "sql", label: "SQL" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
];
```

## Integration with External Systems

### LMS Integration

To integrate with Learning Management Systems:

1. Create an LMS integration module:

```python
# app/integrations/lms.py
class LMSIntegration:
    """Base class for LMS integrations."""
    
    def __init__(self, api_key, api_url):
        self.api_key = api_key
        self.api_url = api_url
    
    def submit_grade(self, student_id, assignment_id, score):
        """Submit a grade to the LMS."""
        pass

class CanvasIntegration(LMSIntegration):
    """Canvas LMS integration."""
    
    def submit_grade(self, student_id, assignment_id, score):
        """Submit a grade to Canvas."""
        # Implementation using Canvas API
        return {"success": True}
```

2. Create API endpoints for LMS integration:

```python
# app/routers/integrations.py
from fastapi import APIRouter, Depends, HTTPException
from ..integrations.lms import CanvasIntegration

router = APIRouter(prefix="/integrations", tags=["Integrations"])

@router.post("/canvas/submit_grade")
async def submit_to_canvas(data: dict):
    """Submit a grade to Canvas LMS."""
    canvas = CanvasIntegration(api_key=data["api_key"], api_url=data["api_url"])
    result = canvas.submit_grade(
        student_id=data["student_id"],
        assignment_id=data["assignment_id"],
        score=data["score"]
    )
    return result
```

### Authentication Providers

To add support for additional authentication providers:

1. Configure Clerk with the desired authentication providers
2. Update the frontend to display the new sign-in options

### Notification Systems

To integrate with notification systems:

1. Create a notification module:

```python
# app/notifications/manager.py
class NotificationManager:
    """Manage different notification channels."""
    
    def send_notification(self, channel, message, recipient):
        """Send a notification through the specified channel."""
        if channel == "email":
            return self._send_email(message, recipient)
        elif channel == "discord":
            return self._send_discord(message, recipient)
        elif channel == "slack":
            return self._send_slack(message, recipient)
        else:
            raise ValueError(f"Unsupported channel: {channel}")
    
    def _send_email(self, message, recipient):
        # Implementation
        pass
    
    def _send_discord(self, message, recipient):
        # Implementation
        pass
    
    def _send_slack(self, message, recipient):
        # Implementation
        pass
```

## Advanced Customizations

For more advanced customizations, consider:

1. **Plugin Architecture**: Implementing a plugin system for extensibility
2. **Custom User Roles**: Adding additional user roles with specific permissions
3. **Advanced Analytics**: Implementing machine learning for personalized learning
4. **Peer Review System**: Adding capabilities for peer assessment
5. **Accessibility Enhancements**: Ensuring compliance with accessibility standards

For detailed implementation guidance on these advanced customizations, please refer to the developer documentation or contact the CSE Exam System development team.
