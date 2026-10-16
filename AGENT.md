# 🤖 Agent Guidelines - My Coaching App

## Project Overview

This is a **NestJS coaching application** that uses AI models (Gemini, OpenAI, Mistral) to generate personalized training plans for athletes. The app focuses on interval training and workout planning.

---

## Tech Stack

- **Framework**: NestJS 12
- **TypeScript**: ES modules (`"type": "module"`)
- **AI Models**: 
  - Google Gemini (primary, `gemini-3.1-flash-lite`)
- **Validation**: Zod + zod-to-json-schema
- **Testing**: Vitest
- **Linting**: oxlint

---

## Architecture

### Core Modules

| Module | Purpose | Key Components |
|--------|---------|----------------|
| `coach/` | AI coaching logic | CoachService, LlmService, PromptBuilder, TrainingContextBuilder |
| `intervals/` | Interval data management | IntervalsClient, IntervalsService |
| `intervals-workouts/` | Workout planning | TrainingPlanPublisherService |

### Data Flow

1. **CoachController** receives requests at `/coach`
2. **CoachService** orchestrates the training plan generation
3. **LlmService** calls AI models with prompts from **PromptBuilder**
4. **TrainingContextBuilder** prepares athlete context data
5. Results are published via **TrainingPlanPublisherService**

---

## Coding Standards

### TypeScript/JavaScript

- ✅ Use ES modules (`import` / `export`)
- ✅ Prefer `.ts` files for all source code
- ✅ Keep imports relative and explicit (`.js` extensions in imports)
- ✅ Use async/await consistently
- ❌ No JSDoc comments needed (unless documenting public APIs)

### AI Integration Pattern

```typescript
// Always validate AI responses with Zod
const plan = TrainingPlanSchema.parse(JSON.parse(aiResponse));

// Use system instructions for consistent behavior
const systemInstruction = this.promptBuilder.buildInstructions();

// Handle empty/invalid responses gracefully
if (!response.text) { throw new Error('Réponse vide de Gemini'); }
```

---

## Important Notes

### AI Model Selection
- **Gemini** is currently active (`gemini-3.1-flash-lite`)
- OpenAI and Mistral are commented out but available for fallback
- Always specify `responseMimeType: 'application/json'` for structured output

### Schema Validation
All AI responses must be validated with Zod schemas before use:
```typescript
import { TrainingPlanSchema } from './training-plan.types';
const plan = TrainingPlanSchema.parse(aiResponse);
```

---

## Common Tasks

### Adding a New Service

1. Create service file in appropriate module folder
2. Inject dependencies via constructor
3. Use `@Injectable()` decorator
4. Export from parent module if needed

### Modifying AI Prompts

Edit `src/coach/PromptBuilder.ts`:
- Update system instructions for behavior changes
- Modify context message formatting
- Ensure JSON schema compatibility

### Adding New Interval Types

1. Define schema in intervals module
2. Extend client to fetch new data
3. Update service logic to handle new types
4. Add validation schemas if needed

---

## Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

See `nest-cli.json` and `.gitignore` for deployment configuration.
