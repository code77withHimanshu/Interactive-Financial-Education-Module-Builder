import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import { QuizBlock } from '../components/Blocks/QuizBlock';
import type { QuizContent } from '../types';

const mockContent: QuizContent = {
  question: 'What is 2 + 2?',
  options: [
    { id: 'opt-a', text: 'Three' },
    { id: 'opt-b', text: 'Four' },
    { id: 'opt-c', text: 'Five' },
    { id: 'opt-d', text: 'Six' },
  ],
  correctOptionId: 'opt-b',
  explanation: 'Two plus two equals four.',
};

describe('QuizBlock - Edit Mode', () => {
  it('renders question textarea', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={true} />);
    expect(screen.getByLabelText(/question/i)).toBeInTheDocument();
  });

  it('renders all 4 options in edit mode', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={true} />);
    expect(screen.getByDisplayValue('Three')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Four')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Five')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Six')).toBeInTheDocument();
  });

  it('calls onChange when question is updated', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={true} />);
    const questionInput = screen.getByLabelText(/question/i);
    act(() => {
      fireEvent.change(questionInput, { target: { value: 'New question?' } });
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ question: 'New question?' })
    );
  });

  it('calls onChange when option text is updated', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={true} />);
    const optionInput = screen.getByDisplayValue('Three');
    act(() => {
      fireEvent.change(optionInput, { target: { value: 'Updated Option' } });
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.arrayContaining([
          expect.objectContaining({ id: 'opt-a', text: 'Updated Option' }),
        ]),
      })
    );
  });

  it('allows selecting the correct option via radio', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={true} />);
    const radios = screen.getAllByRole('radio', { name: /mark option/i });
    act(() => { fireEvent.click(radios[0]); });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ correctOptionId: 'opt-a' })
    );
  });

  it('shows Add option button when less than 4 options', () => {
    const onChange = vi.fn();
    const content = { ...mockContent, options: mockContent.options.slice(0, 2) };
    render(<QuizBlock content={content} onChange={onChange} isEditing={true} />);
    expect(screen.getByText(/add option/i)).toBeInTheDocument();
  });

  it('hides Add option button when 4 options present', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={true} />);
    expect(screen.queryByText(/add option/i)).not.toBeInTheDocument();
  });

  it('calls onChange with new option when Add option is clicked', () => {
    const onChange = vi.fn();
    const content = { ...mockContent, options: mockContent.options.slice(0, 2) };
    render(<QuizBlock content={content} onChange={onChange} isEditing={true} />);
    const addBtn = screen.getByText(/add option/i);
    act(() => { fireEvent.click(addBtn); });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.arrayContaining([
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
        ]),
      })
    );
  });

  it('updates explanation text', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={true} />);
    const explanationInput = screen.getByLabelText(/explanation/i);
    act(() => {
      fireEvent.change(explanationInput, { target: { value: 'New explanation' } });
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ explanation: 'New explanation' })
    );
  });
});

describe('QuizBlock - Preview Mode', () => {
  it('renders question text', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={false} />);
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
  });

  it('renders all options as radio buttons', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={false} />);
    expect(screen.getByLabelText('Three')).toBeInTheDocument();
    expect(screen.getByLabelText('Four')).toBeInTheDocument();
  });

  it('Check Answer button is disabled initially', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={false} />);
    const checkBtn = screen.getByRole('button', { name: /check answer/i });
    expect(checkBtn).toBeDisabled();
  });

  it('enables Check Answer button after selecting an option', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={false} />);
    const optionFour = screen.getByLabelText('Four');
    act(() => { fireEvent.click(optionFour); });
    const checkBtn = screen.getByRole('button', { name: /check answer/i });
    expect(checkBtn).not.toBeDisabled();
  });

  it('shows correct feedback after selecting correct answer', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={false} />);
    act(() => { fireEvent.click(screen.getByLabelText('Four')); });
    act(() => { fireEvent.click(screen.getByRole('button', { name: /check answer/i })); });
    expect(screen.getByText(/correct/i)).toBeInTheDocument();
  });

  it('shows incorrect feedback after selecting wrong answer', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={false} />);
    act(() => { fireEvent.click(screen.getByLabelText('Three')); });
    act(() => { fireEvent.click(screen.getByRole('button', { name: /check answer/i })); });
    expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
  });

  it('shows explanation after checking answer', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={false} />);
    act(() => { fireEvent.click(screen.getByLabelText('Four')); });
    act(() => { fireEvent.click(screen.getByRole('button', { name: /check answer/i })); });
    expect(screen.getByText('Two plus two equals four.')).toBeInTheDocument();
  });

  it('shows Try again button after checking', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={false} />);
    act(() => { fireEvent.click(screen.getByLabelText('Four')); });
    act(() => { fireEvent.click(screen.getByRole('button', { name: /check answer/i })); });
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  it('resets quiz state on Try again', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={false} />);
    act(() => { fireEvent.click(screen.getByLabelText('Four')); });
    act(() => { fireEvent.click(screen.getByRole('button', { name: /check answer/i })); });
    act(() => { fireEvent.click(screen.getByText(/try again/i)); });
    // Check Answer should be back (disabled because no selection)
    expect(screen.getByRole('button', { name: /check answer/i })).toBeInTheDocument();
  });

  it('has aria-live role for result feedback', () => {
    const onChange = vi.fn();
    render(<QuizBlock content={mockContent} onChange={onChange} isEditing={false} />);
    act(() => { fireEvent.click(screen.getByLabelText('Four')); });
    act(() => { fireEvent.click(screen.getByRole('button', { name: /check answer/i })); });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
