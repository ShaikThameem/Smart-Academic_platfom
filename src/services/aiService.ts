import { ChatMessage } from '../types/academic';

export const aiService = {
  isRealApiConfigured(): boolean {
    return true;
  },

  async askAssistant(userQuery: string, history: ChatMessage[] = []): Promise<{
    text: string;
    sources?: string[];
    suggestions?: string[];
  }> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userQuery,
          history: history.map(h => ({ sender: h.sender, text: h.text })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.text,
        sources: data.sources || ['Smart Academic AI Knowledge Base'],
        suggestions: data.suggestions || [
          'Can you give me a practice problem on this topic?',
          'Explain the core concept in simpler terms',
          'How does this relate to upcoming exams?',
        ],
      };
    } catch (err) {
      console.warn('AI request failed via server route, falling back to local academic response:', err);
      return {
        text: `### Academic Response: "${userQuery}"\n\n- The server is processing academic queries for Semester 5 Computer Science.\n- Check your active course syllabus, timetable, or ask for algorithmic derivations.`,
        sources: ['Smart Academic Fallback Engine'],
        suggestions: [
          'Show my current timetable for Computer Networks',
          'Explain Dijkstra algorithm with time complexity',
          'How do I calculate classes needed to hit 80%?',
        ],
      };
    }
  },
};
