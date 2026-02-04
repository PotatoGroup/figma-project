import yaml from "js-yaml";
import { z } from 'zod'
import { readFileSync } from 'fs'
import path from 'path'

export type PromptType = {
  name: string;
  description: string;
  arguments: {
    name: string;
    description: string;
    required?: boolean;
  }[];
  messages: { role: 'assistant' | 'user', content: { type: 'text', text: string } }[];
}

const promptPath = path.join(__dirname, '../prompts/react_workflow.yaml');
const content = readFileSync(promptPath, 'utf8');
const prompt = yaml.load(content) as PromptType;
const parameters = prompt.arguments.reduce((acc: Record<string, z.ZodString>, arg: { name: string, description: string }) => {
  acc[arg.name] = z.string().describe(arg.description);
  return acc;
}, {});

const parametersSchema = z.object(parameters);
export type ReactComponentGeneratorParams = z.infer<typeof parametersSchema>;

const reactComponentGenerator = async (params: ReactComponentGeneratorParams) => {
  const promptText = prompt.messages.map((message) => message.content.text).join("\n");
  const promptTextWithParams = promptText.replace(/{{(.*?)}}/g, (match, p1) => params[p1] as string);
  return {
    content: [
      {
        type: "text",
        text: promptTextWithParams.trim()
      }
    ]
  };
};

export const reactComponentGeneratorTool = {
  name: prompt.name,
  description: prompt.description,
  parameters,
  execute: reactComponentGenerator,
};