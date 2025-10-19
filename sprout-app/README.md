# Sprout - Financial Literacy App

A gamified financial literacy app for children and parents, built with Next.js, Tailwind CSS, and Supabase.

## Features

### For Children
- **Dashboard**: View balance, credit score, and savings goals
- **Missions**: Complete chores to earn rewards and improve credit score
- **Shop**: Purchase items with earned allowance
- **Group Savings**: Collaborate with others on shared savings goals

### For Parents (Guardians)
- **Child Management**: Monitor multiple children's progress
- **Mission Creation**: Assign chores with rewards and deadlines
- **Mission Approval**: Review and approve completed missions
- **Money Transfers**: Send allowance to children

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (ready for integration)
- **Authentication**: Supabase Auth (ready for integration)

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Integration

The app is structured to easily integrate with Supabase. Type definitions are in `lib/types.ts` and mock data is in `lib/mock-data.ts`.

### Recommended Database Schema

**users**
- id (uuid, primary key)
- username (text, unique)
- role (text: 'guardian' | 'child')
- guardian_id (uuid, foreign key to users, nullable)
- name (text, nullable)
- balance (decimal, default 0)
- credit_score (integer, default 0)
- created_at (timestamp)

**missions**
- id (uuid, primary key)
- child_id (uuid, foreign key to users)
- name (text)
- description (text, nullable)
- reward (decimal)
- deadline (date)
- status (text: 'pending' | 'completed' | 'approved' | 'rejected')
- created_at (timestamp)
- completed_at (timestamp, nullable)
- approved_at (timestamp, nullable)

**goals**
- id (uuid, primary key)
- child_id (uuid, foreign key to users)
- name (text)
- target_amount (decimal)
- current_amount (decimal, default 0)
- created_at (timestamp)

**shop_items**
- id (uuid, primary key)
- name (text)
- price (decimal)
- image_url (text, nullable)
- created_at (timestamp)

**purchases**
- id (uuid, primary key)
- child_id (uuid, foreign key to users)
- item_id (uuid, foreign key to shop_items)
- price (decimal)
- purchased_at (timestamp)

**group_savings**
- id (uuid, primary key)
- name (text)
- target_amount (decimal)
- current_amount (decimal, default 0)
- created_at (timestamp)

**group_savings_members**
- id (uuid, primary key)
- group_savings_id (uuid, foreign key to group_savings)
- child_id (uuid, foreign key to users)
- joined_at (timestamp)

**contributions**
- id (uuid, primary key)
- group_savings_id (uuid, foreign key to group_savings)
- child_id (uuid, foreign key to users)
- amount (decimal)
- contributed_at (timestamp)

**transactions**
- id (uuid, primary key)
- from_id (uuid, foreign key to users, nullable)
- to_id (uuid, foreign key to users)
- amount (decimal)
- type (text: 'transfer' | 'mission_reward' | 'purchase' | 'contribution')
- description (text, nullable)
- created_at (timestamp)

## Credit Score System

The credit score increases when children:
- Complete missions on time
- Save towards goals consistently
- Make responsible purchases

The credit score affects:
- Allowance multiplier (higher score = higher rewards)
- Access to premium shop items
- Group savings participation

## Project Structure

\`\`\`
app/
├── page.tsx                    # Landing page
├── login/                      # Login role selection
├── signup/                     # Signup role selection
├── guardian/
│   ├── signup/                 # Guardian registration
│   ├── login/                  # Guardian login
│   ├── add-child/              # Add child accounts
│   ├── dashboard/              # Guardian dashboard
│   └── add-mission/            # Create missions
└── child/
    ├── signup/                 # Child login (no registration)
    └── dashboard/              # Child dashboard with tabs

components/
├── ui/                         # shadcn/ui components
├── piggy-bank.tsx              # Piggy bank illustration
├── sprout-logo.tsx             # App logo
├── contribute-modal.tsx        # Group savings contribution
└── transfer-money-modal.tsx    # Parent money transfer

lib/
├── types.ts                    # TypeScript type definitions
└── mock-data.ts                # Mock data for development
\`\`\`

## Design System

**Colors:**
- Primary Green: #3ecf8e
- Dark Green: #2ba86f
- Light Green: #e8f9f3
- Pink (Piggy Bank): #ffb6c1
- Red (Alerts): #ef4444

**Typography:**
- Font Family: Inter
- Headings: Bold, large sizes
- Body: Regular weight, comfortable line height

**Components:**
- Rounded corners (0.625rem radius)
- Soft shadows for cards
- Green gradient backgrounds
- Piggy bank mascot footer

## License

MIT
