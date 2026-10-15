import { Injectable } from "@nestjs/common";
import { PromptBuilder } from "./PrompBuilder.js";
import { TrainingContext } from "../intervals/interfaces/TrainingContext.js";
import OpenAI from "openai";
import { Content, GoogleGenAI } from "@google/genai";
import { z } from 'zod';
import { TrainingPlan, TrainingPlanSchema } from "../intervals-workouts/training-plan.types.js";
import { TrainingPlanPublisherService } from "../intervals-workouts/training-plan-publisher.service.js";


@Injectable()
export class LlmService {
    private readonly openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    constructor(
        private readonly promptBuilder: PromptBuilder,
        private readonly publisher: TrainingPlanPublisherService
    ) { }

    async generateTrainingPlan(
        context: TrainingContext,
    ): Promise<TrainingPlan> {

        const ai = new GoogleGenAI({});

        const systemInstruction = this.promptBuilder.buildInstructions();

        // 2. On prépare le message de l'utilisateur (ou l'historique) au format Gemini
        const contents: Content[] = [
            {
                role: 'user',
                parts: [
                    {
                        text: this.promptBuilder.buildContextMessage(context)
                    }
                ],
            },
        ];

        // 3. Appel à l'API Gemini
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: z.toJSONSchema(TrainingPlanSchema),
            }
        });

        // const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

        // const response = await client.chat.complete({
        //     model: "mistral-large-latest",
        //     messages: [
        //         {
        //             role: 'system',
        //             content: this.promptBuilder.buildInstructions(),
        //         },
        //         {
        //             role: 'user',
        //             content: this.promptBuilder.buildContextMessage(context),
        //         },
        //     ],
        // });

        // console.log(response.choices[0]?.message?.content);

        // const response = await this.openai.responses.parse({
        //     model: 'gpt-5.5',
        //     input: [
        //         {
        //             role: 'system',
        //             content: this.promptBuilder.buildInstructions(),
        //         },
        //         {
        //             role: 'user',
        //             content: this.promptBuilder.buildContextMessage(context),
        //         },
        //     ],
        //     text: {
        //         format: zodTextFormat(
        //             TrainingPlanSchema,
        //             'training_plan',
        //         ),
        //     },
        // });

        // const plan = response.output_parsed;

        if (!response.text) {
            throw new Error('Réponse vide de Gemini');
        }

        const plan = response.text;

        if (!plan) {
            throw new Error(
                'Le LLM n’a pas retourné de plan exploitable.',
            );
        }

        const preview = this.publisher.preview(JSON.parse(plan));

        const publishResponse = await this.publisher.publish(JSON.parse(plan));

        //console.log(publishResponse)

        // Validation explicite côté application
        return TrainingPlanSchema.parse(JSON.parse(plan));
    }
}