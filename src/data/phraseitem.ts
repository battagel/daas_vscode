export type PhraseItem = {
    phrase: string;
    terms: string[]
    last_update: string
    complexity: number
    tags: string[]
    explanations: PhraseExplanation[]
};

type PhraseExplanation = {
    definition: string
    tags: string[]
    code: string[]
    references: string[]
    heat: number
}
