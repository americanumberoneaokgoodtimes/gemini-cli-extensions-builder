import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useProactiveAssistant } from './useProactiveAssistant';

// Mock fetch
global.fetch = vi.fn();

describe('useProactiveAssistant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start thinking when fetch is called and perform initial fetch', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ message: 'test', patch: {} }) } }]
      }),
    });

    const { result } = renderHook(() => useProactiveAssistant({}));

    expect(result.current.isThinking).toBe(true);
    
    await waitFor(() => expect(result.current.isThinking).toBe(false));

    expect(result.current.suggestion).toEqual({ message: 'test', patch: {} });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should strip markdown blocks from Gemma response', async () => {
    const markdownResponse = "```json\n" + JSON.stringify({ message: 'markdown test', patch: {} }) + "\n```";
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: markdownResponse } }]
      }),
    });

    const { result } = renderHook(() => useProactiveAssistant({}));

    await waitFor(() => expect(result.current.suggestion).not.toBeNull());

    expect(result.current.suggestion).toEqual({ message: 'markdown test', patch: {} });
  });

  it('should handle invalid JSON from Gemma gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'invalid json' } }]
      }),
    });

    const { result } = renderHook(() => useProactiveAssistant({}));

    await waitFor(() => expect(result.current.isThinking).toBe(false));
    
    expect(result.current.suggestion).toBe(null);
    expect(consoleSpy).toHaveBeenCalledWith("Failed to parse Gemma response as JSON:", "invalid json");
    consoleSpy.mockRestore();
  });

  it('should clear suggestion when clearSuggestion is called', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ message: 'test', patch: {} }) } }]
      }),
    });

    const { result } = renderHook(() => useProactiveAssistant({}));

    await waitFor(() => expect(result.current.suggestion).not.toBeNull());

    act(() => {
      result.current.clearSuggestion();
    });

    expect(result.current.suggestion).toBe(null);
  });

  it('should poll for suggestions at intervalMs', async () => {
    vi.useFakeTimers();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ message: 'test', patch: {} }) } }]
      }),
    });

    renderHook(() => useProactiveAssistant({}, 'http://test.com', 5000));

    // Initial call (immediate)
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Advance time to trigger interval
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(3);
    
    vi.useRealTimers();
  });

  it('should abort fetch and not update state on unmount', async () => {
    const abortSpy = vi.fn();
    const originalAbortController = global.AbortController;
    
    // Use a regular function so it can be used as a constructor
    global.AbortController = vi.fn().mockImplementation(function() {
      return {
        abort: abortSpy,
        signal: { aborted: false }
      };
    }) as any;

    (global.fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { unmount } = renderHook(() => useProactiveAssistant({}));

    unmount();

    expect(abortSpy).toHaveBeenCalled();
    
    global.AbortController = originalAbortController;
  });
});
