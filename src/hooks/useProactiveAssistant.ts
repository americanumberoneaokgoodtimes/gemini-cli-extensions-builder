import { useState, useEffect, useRef } from 'react';

// Define the expected JSON structure from Gemma
export interface AssistantSuggestion {
  message: string;
  patch: Partial<any>; // Will refine type when integrating with App.tsx
}

export function useProactiveAssistant(
  currentFormData: any, 
  endpointUrl: string = 'http://localhost:8080/v1/chat/completions', // Default for local dev, user configures for homelab
  intervalMs: number = 30000
) {
  const [suggestion, setSuggestion] = useState<AssistantSuggestion | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const formDataRef = useRef(currentFormData);

  // Keep ref updated to avoid triggering effect on every form change
  useEffect(() => {
    formDataRef.current = currentFormData;
  }, [currentFormData]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchSuggestion = async () => {
      setIsThinking(true);
      try {
        const systemPrompt = `You are a proactive assistant for a Gemini CLI extension builder. 
Look at the current hook configuration. Suggest ONE specific, actionable improvement. 
You MUST respond with valid JSON matching this schema: 
{"message": "A short, friendly tip", "patch": {"code": "The full updated code string if you suggest a code change", "trigger": "updated_trigger_if_needed"}}. 
Do not include markdown blocks, just raw JSON.`;

        const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
          body: JSON.stringify({
            model: 'gemma', // Name depends on llama.cpp setup
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Current State: ${JSON.stringify(formDataRef.current)}` }
            ],
            temperature: 0.2,
          }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error("Failed to parse response envelope as JSON");
        }

        const content = data.choices[0].message.content;
        
        // LLMs often wrap JSON in markdown blocks. Strip them before parsing.
        const jsonContent = content.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

        // Attempt to parse the JSON response
        try {
          const parsedSuggestion: AssistantSuggestion = JSON.parse(jsonContent);
          if (parsedSuggestion.message && parsedSuggestion.patch && !abortController.signal.aborted) {
            setSuggestion(parsedSuggestion);
          }
        } catch (parseError) {
          console.error("Failed to parse Gemma response as JSON:", jsonContent);
        }

      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error("Proactive assistant error:", error);
      } finally {
        if (!abortController.signal.aborted) {
          setIsThinking(false);
        }
      }
    };

    const intervalId = setInterval(fetchSuggestion, intervalMs);
    
    // Initial fetch
    fetchSuggestion();

    return () => {
      abortController.abort();
      clearInterval(intervalId);
    };
  }, [endpointUrl, intervalMs]);

  const clearSuggestion = () => setSuggestion(null);

  return { suggestion, isThinking, clearSuggestion };
}
