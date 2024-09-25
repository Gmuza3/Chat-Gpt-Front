export type Choices = {
    index: number;
    message: {
      role: string;
      content: string;
      refusal: any;
    };
    logprobs: any;
    finish_reason: string;
  };
  
type ResponseType ={
  id: string,
  object: string,
  created: number,
  model: string,
  choices: [Choices],
  usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number },
  system_fingerprint: string
}

export default ResponseType