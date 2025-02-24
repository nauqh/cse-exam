# Devlog

```
/ (Home)                    # Landing page
├── /auth                   # Authentication routes managed by Clerk
│   ├── /sign-in           
│   └── /sign-up          
│
├── /exams                  # Main exam portal listing available exams
│   └── /[examId]           # Specific exam page (M11, M12, M21, M31)
│       ├── /multichoice    # Multiple choice section with 20 questions
│       │   └── /[id]       
│       ├── /problem        # Coding problems section
│       │   └── /[id]      
│       └── /final          # Final submission and review page
│           └── /success   
│
├── /profile                # User profile and settings management
│   ├── /?view=history    
│   └── /?view=settings   
│
├── /courses                # Course catalog and learning materials
│   └── /[courseId]         # Individual course page
│       └── /assignments    # Course assignments and practice problems
│
├── /v0                     # Public version of exam system (No need to sign in)
│   └── /[examId]        
│       ├── /multichoice 
│       ├── /problem      
│       └── /final       
│
└── /submissions          # Submission review and results
    └── /[examId]/[submissionId] 
```