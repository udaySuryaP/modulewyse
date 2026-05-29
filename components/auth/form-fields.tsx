"use client";

import { ChevronDown, Eye, EyeOff } from "lucide-react";
import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const inputClassName =
  "mw-input h-10 px-[var(--mw-space-md)] text-[length:var(--mw-type-body)] font-normal sm:h-12";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="mw-meta font-normal">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  if (isPassword) {
    return (
      <div className="relative">
        <input
          className={cn(inputClassName, "w-full pr-12", className)}
          type={showPassword ? "text" : "password"}
          {...props}
        />
        <button
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center mw-radius-pill border border-[var(--mw-hairline)] bg-[var(--mw-canvas)] text-[var(--mw-muted)] transition-colors hover:text-[var(--mw-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-ink)]/20"
          onClick={() => setShowPassword((current) => !current)}
          type="button"
        >
          {showPassword ? (
            <EyeOff className="size-4" strokeWidth={1.8} />
          ) : (
            <Eye className="size-4" strokeWidth={1.8} />
          )}
        </button>
      </div>
    );
  }

  return (
    <input
      className={cn(inputClassName, className)}
      type={type}
      {...props}
    />
  );
}

export function SelectInput({
  className,
  children,
  disabled,
  id,
  name,
  onBlur,
  onChange,
  required,
  value,
  defaultValue,
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(
    defaultValue === undefined ? "" : String(defaultValue),
  );

  const options = useMemo(
    () =>
      Children.toArray(children)
        .filter(isValidElement)
        .map((child) => {
          const option = child as React.ReactElement<
            React.OptionHTMLAttributes<HTMLOptionElement>
          >;
          const optionValue =
            option.props.value === undefined
              ? String(option.props.children ?? "")
              : String(option.props.value);

          return {
            disabled: Boolean(option.props.disabled),
            label: option.props.children,
            value: optionValue,
          };
        }),
    [children],
  );

  const selectedValue =
    value === undefined ? internalValue : Array.isArray(value) ? value[0] ?? "" : String(value);
  const selectedOption =
    options.find((option) => option.value === selectedValue) ??
    options.find((option) => !option.disabled);
  const selectedLabel = selectedOption?.label ?? "Select";
  const visibleOptions = options.filter(
    (option) => option.value.trim() !== "" && !option.disabled,
  );

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function emitChange(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    const target = {
      id,
      name,
      value: nextValue,
    } as HTMLSelectElement;

    onChange?.({
      currentTarget: target,
      target,
    } as React.ChangeEvent<HTMLSelectElement>);
  }

  function selectOption(nextValue: string, optionDisabled: boolean) {
    if (disabled || optionDisabled) {
      return;
    }

    emitChange(nextValue);
    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((current) => !current);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <span className="relative block" ref={wrapperRef}>
      <input
        aria-hidden="true"
        name={name}
        required={required}
        tabIndex={-1}
        type="hidden"
        value={selectedValue}
      />
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "mw-select flex items-center justify-between gap-3 py-0 pl-[var(--mw-space-md)] pr-2.5 text-left text-[length:var(--mw-type-link)] font-medium disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        disabled={disabled}
        id={id}
        onBlur={(event) => onBlur?.(event as unknown as React.FocusEvent<HTMLSelectElement>)}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <span className="min-w-0 flex-1 truncate">{selectedLabel}</span>
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center mw-radius-card bg-white text-[var(--mw-muted)]"
        >
          <ChevronDown
            className={cn("size-4 transition-transform", isOpen && "rotate-180")}
          />
        </span>
      </button>
      {isOpen ? (
        <span
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 block max-h-72 overflow-y-auto mw-radius-card border border-[var(--mw-hairline)] bg-white p-1.5 shadow-[0_18px_60px_rgba(10,11,13,0.12)]"
          role="listbox"
        >
          {visibleOptions.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                aria-selected={isSelected}
                className={cn(
                  "block w-full mw-radius-card px-3 py-2.5 text-left text-[13px] font-medium leading-[1.35] text-[var(--mw-body)] transition-colors hover:bg-[var(--mw-surface-strong)] hover:text-[var(--mw-ink)]",
                  isSelected && "bg-[var(--mw-surface-strong)] text-[var(--mw-ink)]",
                )}
                key={option.value}
                onClick={() => selectOption(option.value, false)}
                role="option"
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </span>
      ) : null}
    </span>
  );
}

export function FormMessage({
  children,
  tone = "error",
}: {
  children: React.ReactNode;
  tone?: "error" | "success" | "muted";
}) {
  return (
    <p
      className={cn(
        "text-center text-[length:var(--mw-type-link)] font-normal leading-[1.4] tracking-[-0.01em]",
        tone === "error" && "text-[var(--mw-ink)]",
        tone === "success" && "text-[var(--mw-ink)]",
        tone === "muted" && "text-[var(--mw-muted)]",
      )}
    >
      {children}
    </p>
  );
}
