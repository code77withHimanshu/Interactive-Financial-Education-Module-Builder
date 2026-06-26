import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import { CalculatorBlock } from '../components/Blocks/CalculatorBlock';
import type { CalculatorContent } from '../types';

const defaultContent: CalculatorContent = {
  principal: 1000,
  rate: 10,
  years: 3,
  compoundingFrequency: 1,
};

describe('CalculatorBlock', () => {
  describe('Calculation logic', () => {
    it('displays the correct final amount for basic compound interest', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      // 1000 * (1.10)^3 = 1331.00
      expect(screen.getByText('$1,331.00')).toBeInTheDocument();
    });

    it('displays interest earned correctly', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      // Interest = 1331 - 1000 = 331
      expect(screen.getByText('$331.00')).toBeInTheDocument();
    });

    it('shows principal amount', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    });

    it('shows growth percentage', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      // 331/1000 = 33%
      expect(screen.getByText('+33%')).toBeInTheDocument();
    });
  });

  describe('Input interactions - Preview Mode', () => {
    it('calls onChange when principal is changed', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      const principalInput = screen.getByLabelText(/initial investment/i);
      act(() => {
        fireEvent.change(principalInput, { target: { value: '5000' } });
      });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ principal: 5000 })
      );
    });

    it('calls onChange when rate is changed', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      const rateInput = screen.getByLabelText(/annual interest rate/i);
      act(() => {
        fireEvent.change(rateInput, { target: { value: '7' } });
      });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ rate: 7 })
      );
    });

    it('calls onChange when years is changed', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      const yearsInput = screen.getByLabelText(/time period/i);
      act(() => {
        fireEvent.change(yearsInput, { target: { value: '20' } });
      });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ years: 20 })
      );
    });

    it('calls onChange when compounding frequency is changed', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      const freqSelect = screen.getByLabelText(/compounding frequency/i);
      act(() => {
        fireEvent.change(freqSelect, { target: { value: '12' } });
      });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ compoundingFrequency: 12 })
      );
    });
  });

  describe('Input interactions - Edit Mode', () => {
    it('renders all inputs in edit mode', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={true} />);
      expect(screen.getByLabelText(/initial investment/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/annual interest rate/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time period/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/compounding frequency/i)).toBeInTheDocument();
    });

    it('calls onChange when principal changes in edit mode', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={true} />);
      const principalInput = screen.getByLabelText(/initial investment/i);
      act(() => {
        fireEvent.change(principalInput, { target: { value: '2000' } });
      });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ principal: 2000 })
      );
    });
  });

  describe('Edge cases', () => {
    it('handles zero principal', () => {
      const onChange = vi.fn();
      const content = { ...defaultContent, principal: 0 };
      render(<CalculatorBlock content={content} onChange={onChange} isEditing={false} />);
      // Multiple $0.00 values appear (final amount, principal, interest all show 0)
      const zeroElements = screen.getAllByText('$0.00');
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    it('handles large values', () => {
      const onChange = vi.fn();
      const content = { ...defaultContent, principal: 100000, rate: 8, years: 30 };
      render(<CalculatorBlock content={content} onChange={onChange} isEditing={false} />);
      // Should show final amount (multiple currency values appear - use getAllByText)
      const currencyElements = screen.getAllByText(/\$[0-9,]+\.[0-9]+/);
      expect(currencyElements.length).toBeGreaterThan(0);
      // The final amount should be roughly $1,006,265
      const finalAmountEl = document.querySelector('[aria-live="polite"]');
      expect(finalAmountEl).toBeInTheDocument();
      expect(finalAmountEl?.textContent).toMatch(/\$1,\d+/);
    });

    it('displays formula in preview mode', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      expect(screen.getByText(/formula/i)).toBeInTheDocument();
    });

    it('shows duration in results', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      expect(screen.getByText('3 yrs')).toBeInTheDocument();
    });

    it('shows singular yr for 1 year', () => {
      const onChange = vi.fn();
      const content = { ...defaultContent, years: 1 };
      render(<CalculatorBlock content={content} onChange={onChange} isEditing={false} />);
      expect(screen.getByText('1 yr')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has aria-live on result', () => {
      const onChange = vi.fn();
      render(<CalculatorBlock content={defaultContent} onChange={onChange} isEditing={false} />);
      // The final amount should have aria-live="polite"
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });
  });
});
