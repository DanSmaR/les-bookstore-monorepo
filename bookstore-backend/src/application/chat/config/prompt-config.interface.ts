export interface PromptConfigTemplate {
  systemRole: string;
  instructions: string[];
  responseFormat: {
    type: 'json';
    schemaDescription: string;
  };
  maxRecommendations?: number;
  catalogDisplayLimit?: number;
}
