import React, { useMemo } from 'react';
import { Calculator } from 'lucide-react';
import type { CalculatorContent } from '../../types';

interface CalculatorBlockProps {
  content: CalculatorContent;
  onChange: (content: CalculatorContent) => void;
  isEditing: boolean;
}

function calculateCompoundInterest(
  principal: number,
  ratePercent: number,
  years: number,
  n: number = 1
): { finalAmount: number; totalInterest: number } {
  if (principal <= 0 || ratePercent < 0 || years <= 0) {
    return { finalAmount: principal, totalInterest: 0 };
  }
  const r = ratePercent / 100;
  const finalAmount = principal * Math.pow(1 + r / n, n * years);
  return {
    finalAmount: Math.round(finalAmount * 100) / 100,
    totalInterest: Math.round((finalAmount - principal) * 100) / 100,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  prefix?: string;
}

function NumberInput({ id, label, value, onChange, min = 0, max, step = 1, suffix, prefix }: NumberInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor={id}>
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-slate-500 text-sm pointer-events-none" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          min={min}
          max={max}
          step={step}
          className={`w-full py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 ${
            prefix ? 'pl-7 pr-3' : suffix ? 'pl-3 pr-8' : 'px-3'
          }`}
          aria-label={`${label}${suffix ? ` in ${suffix}` : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 text-slate-500 text-sm pointer-events-none" aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function CalculatorBlock({ content, onChange, isEditing }: CalculatorBlockProps) {
  const { finalAmount, totalInterest } = useMemo(
    () =>
      calculateCompoundInterest(
        content.principal,
        content.rate,
        content.years,
        content.compoundingFrequency
      ),
    [content.principal, content.rate, content.years, content.compoundingFrequency]
  );

  const growthPercent = content.principal > 0
    ? Math.round(((finalAmount - content.principal) / content.principal) * 100)
    : 0;

  const ResultCard = () => (
    <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-5 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={20} aria-hidden="true" />
        <span className="font-medium text-blue-100">Results</span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-blue-200 text-xs uppercase tracking-wider mb-0.5">Final Amount</p>
          <p className="text-3xl font-bold" aria-live="polite" aria-atomic="true">
            {formatCurrency(finalAmount)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-700">
          <div>
            <p className="text-blue-200 text-xs mb-0.5">Principal</p>
            <p className="font-semibold">{formatCurrency(content.principal)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs mb-0.5">Interest Earned</p>
            <p className="font-semibold text-emerald-300">{formatCurrency(totalInterest)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs mb-0.5">Growth</p>
            <p className="font-semibold text-amber-300">+{growthPercent}%</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs mb-0.5">Duration</p>
            <p className="font-semibold">
              {content.years} yr{content.years !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="calc-principal"
            label="Initial Investment"
            value={content.principal}
            onChange={(v) => onChange({ ...content, principal: v })}
            min={0}
            step={100}
            prefix="$"
          />
          <NumberInput
            id="calc-rate"
            label="Annual Interest Rate"
            value={content.rate}
            onChange={(v) => onChange({ ...content, rate: Math.min(100, Math.max(0, v)) })}
            min={0}
            max={100}
            step={0.1}
            suffix="%"
          />
          <NumberInput
            id="calc-years"
            label="Time Period"
            value={content.years}
            onChange={(v) => onChange({ ...content, years: Math.max(1, v) })}
            min={1}
            max={100}
            step={1}
            suffix="yrs"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="calc-frequency">
              Compounding Frequency
            </label>
            <select
              id="calc-frequency"
              value={content.compoundingFrequency}
              onChange={(e) => onChange({ ...content, compoundingFrequency: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
            >
              <option value={1}>Annually</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
              <option value={365}>Daily</option>
            </select>
          </div>
        </div>
        <ResultCard />
      </div>
    );
  }

  // Preview mode - interactive
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput
          id="calc-preview-principal"
          label="Initial Investment"
          value={content.principal}
          onChange={(v) => onChange({ ...content, principal: v })}
          min={0}
          step={100}
          prefix="$"
        />
        <NumberInput
          id="calc-preview-rate"
          label="Annual Interest Rate"
          value={content.rate}
          onChange={(v) => onChange({ ...content, rate: Math.min(100, Math.max(0, v)) })}
          min={0}
          max={100}
          step={0.1}
          suffix="%"
        />
        <NumberInput
          id="calc-preview-years"
          label="Time Period"
          value={content.years}
          onChange={(v) => onChange({ ...content, years: Math.max(1, v) })}
          min={1}
          max={100}
          step={1}
          suffix="yrs"
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="calc-preview-frequency">
            Compounding Frequency
          </label>
          <select
            id="calc-preview-frequency"
            value={content.compoundingFrequency}
            onChange={(e) => onChange({ ...content, compoundingFrequency: Number(e.target.value) })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
          >
            <option value={1}>Annually</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
            <option value={365}>Daily</option>
          </select>
        </div>
      </div>
      <ResultCard />
      <p className="text-xs text-slate-400">
        Formula: A = P(1 + r/n)^(nt) &mdash; P={formatCurrency(content.principal)}, r={content.rate}%, n={content.compoundingFrequency}, t={content.years} years
      </p>
    </div>
  );
}
