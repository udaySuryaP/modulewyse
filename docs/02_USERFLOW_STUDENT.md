# 02 — Student User Flow

## Signup
```txt
/ → START FOR FREE → /signup → create account → /onboarding/academic-profile
```

## Login
```txt
/login → sign in
├── onboarding complete → /chat
└── onboarding incomplete → /onboarding/academic-profile
```

## Onboarding
```txt
/onboarding/academic-profile → college + graduation year
/onboarding/branch → CSE selected, other branches coming later
/onboarding/semester → S1–S8
/onboarding/final-setup → focus subject + referral → /chat
```

## Protected route logic
```txt
Unauthenticated /chat → /login
Incomplete onboarding /chat → /onboarding/academic-profile
Logged-in user visits /login → /chat
Onboarded user visits onboarding → /chat
```

## Ask question
```txt
/chat
→ select semester
→ select subject
→ optional module
→ answer type
→ ask question
→ loading
→ answer card
→ copy / feedback
```

## No subject selected
Composer disabled with: “Select a subject before asking.”

## Insufficient content
Show card: “I do not have enough verified material for this answer yet.”
Actions: Try another question, Request this topic.

## Subjects
```txt
/subjects → filter/search → subject detail → start chat
```

## Library
```txt
/library → filter questions → ASK AI → /chat with question prefilled
```

## Profile/settings/sign out
```txt
/profile → edit profile / open settings / sign out
/settings → account / academic / preferences / session
session → sign out modal → /login
```
