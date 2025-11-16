export const actionPrompts: Record<string, (text: string) => string> = {
  fix: (text) =>
    `You are an expert proofreader. Your ONLY task is to correct the grammar and spelling of the text inside the triple quotes. Respond ONLY with the corrected text. Do NOT include quotes, code blocks, or any delimiters. The output language MUST be the same as the input language. Do NOT translate the text.

Text:
"""
${text}
"""`,

  formal: (text) =>
    `You are an expert writer. Your ONLY task is to rewrite the text inside the triple quotes in a formal and professional tone. Respond ONLY with the rewritten text. Do NOT include quotes, code blocks, or any delimiters. The output language MUST be the same as the input language. Do NOT translate the text.

Text:
"""
${text}
"""`,

  informal: (text) =>
    `You are an expert writer. Your ONLY task is to rewrite the text inside the triple quotes in an informal and casual tone. Respond ONLY with the rewritten text. Do NOT include quotes, code blocks, or any delimiters. The output language MUST be the same as the input language. Do NOT translate the text.

Text:
"""
${text}
"""`,

  friendly: (text) =>
    `You are an expert writer. Your ONLY task is to rewrite the text inside the triple quotes in a friendly and approachable tone. Respond ONLY with the rewritten text. Do NOT include quotes, code blocks, or any delimiters. The output language MUST be the same as the input language. Do NOT translate the text.

Text:
"""
${text}
"""`,

  summarize: (text) =>
    `You are an expert summarizer. Your ONLY task is to summarize the text inside the triple quotes concisely. Respond ONLY with the summarized text. Do NOT include quotes, code blocks, or any delimiters. The output language MUST be the same as the input language. Do NOT translate the text.

Text:
"""
${text}
"""`,

  shorten: (text) =>
    `You are an expert editor. Your ONLY task is to rewrite the text inside the triple quotes to be shorter and more concise. Respond ONLY with the shortened text. Do NOT include quotes, code blocks, or any delimiters. The output language MUST be the same as the input language. Do NOT translate the text.

Text:
"""
${text}
"""`,

  expand: (text) =>
    `You are an expert writer. Your ONLY task is to expand the text inside the triple quotes with more detail and explanation. Respond ONLY with the expanded text. Do NOT include quotes, code blocks, or any delimiters. The output language MUST be the same as the input language. Do NOT translate the text.

Text:
"""
${text}
"""`,
};

export const translationPrompt = (text: string, lang: string): string =>
  `You are a translator. Your ONLY task is to translate the text inside the triple quotes to ${lang}. Return ONLY the translated text. Do NOT include quotes, code blocks, or any delimiters.

Text:
"""
${text}
"""`;
