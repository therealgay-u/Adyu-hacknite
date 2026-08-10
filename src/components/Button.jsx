import React from 'react';

/**
 * Button component per COMPONENTS.md:
 * - Primary: Slate Navy (#1E293B) fill, white text, rounded corners 6-8px
 * - Secondary: white fill, slate border (#E2E8F0), slate text
 * - Only one primary button visible per view/section at a time
 *
 * @param {Object} props
 * @param {'primary' | 'secondary'} [props.variant='primary']
 * @param {React.ReactNode} props.children
 * @param {function} [props.onClick]
 * @param {'button' | 'submit' | 'reset'} [props.type='button']
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className='']
 */
export default function Button({
  variant = 'primary',
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold text-sm px-4 py-2 rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-slate-navy focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles =
    variant === 'secondary'
      ? 'bg-surface text-slate-navy border border-slate-light hover:bg-slate-50 active:bg-slate-100'
      : 'bg-slate-navy text-white hover:bg-slate-deep active:bg-slate-900';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
