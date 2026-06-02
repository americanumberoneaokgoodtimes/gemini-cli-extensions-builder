import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssistantBox } from './AssistantBox';
import React from 'react';

describe('AssistantBox', () => {
  const mockSuggestion = {
    message: 'Test suggestion',
    patch: { foo: 'bar' }
  };

  it('renders idle state when no suggestion', () => {
    render(
      <AssistantBox 
        suggestion={null} 
        isThinking={false} 
        onApply={() => {}} 
        onDismiss={() => {}} 
      />
    );
    expect(screen.getByText(/Observing your code/i)).toBeDefined();
  });

  it('renders suggestion when provided', () => {
    render(
      <AssistantBox 
        suggestion={mockSuggestion} 
        isThinking={false} 
        onApply={() => {}} 
        onDismiss={() => {}} 
      />
    );
    expect(screen.getByText('Test suggestion')).toBeDefined();
    expect(screen.getByText('Yeah!')).toBeDefined();
  });

  it('shows thinking indicator', () => {
    const { container } = render(
      <AssistantBox 
        suggestion={null} 
        isThinking={true} 
        onApply={() => {}} 
        onDismiss={() => {}} 
      />
    );
    // Loader2 has class animate-spin
    const loader = container.querySelector('.animate-spin');
    expect(loader).toBeDefined();
  });

  it('calls onApply and onDismiss when Yeah! is clicked', () => {
    const onApply = vi.fn();
    const onDismiss = vi.fn();
    render(
      <AssistantBox 
        suggestion={mockSuggestion} 
        isThinking={false} 
        onApply={onApply} 
        onDismiss={onDismiss} 
      />
    );
    
    fireEvent.click(screen.getByText('Yeah!'));
    expect(onApply).toHaveBeenCalledWith(mockSuggestion.patch);
    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls onDismiss when Dismiss is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <AssistantBox 
        suggestion={mockSuggestion} 
        isThinking={false} 
        onApply={() => {}} 
        onDismiss={onDismiss} 
      />
    );
    
    fireEvent.click(screen.getByText('Dismiss'));
    expect(onDismiss).toHaveBeenCalled();
  });
});
