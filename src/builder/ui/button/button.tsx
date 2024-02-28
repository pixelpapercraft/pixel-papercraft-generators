import {
  makeButtonClassNames,
  type ButtonSize,
  type ButtonColor,
} from "./buttonStyles";

export type { ButtonSize, ButtonColor } from "./buttonStyles";

type BaseButtonProps = {
  size: ButtonSize;
  color: ButtonColor;
  children: React.ReactNode;
  buttonAttributes?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

function BaseButton({
  size,
  color,
  children,
  buttonAttributes,
}: BaseButtonProps) {
  const classNameWithStyles = makeButtonClassNames({ size, color });

  const disabled = buttonAttributes && buttonAttributes.disabled ? true : false;
  const ariaDisabled = disabled ? true : undefined;

  return (
    <button
      className={classNameWithStyles}
      disabled={disabled}
      aria-disabled={ariaDisabled}
      {...buttonAttributes}
    >
      {children}
    </button>
  );
}

export type ButtonState = "Ready" | "Disabled";

function makeButtonProps(state: ButtonState): {
  disabled: boolean;
} {
  switch (state) {
    case "Ready":
      return {
        disabled: false,
      };
    case "Disabled":
      return {
        disabled: true,
      };
  }
}

export type ButtonProps = {
  children: React.ReactNode;
  state?: ButtonState;
  size?: ButtonSize;
  color?: ButtonColor;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function Button({
  children,
  state = "Ready",
  size = "Medium",
  color = "Blue",
  onClick,
}: ButtonProps) {
  const { disabled } = makeButtonProps(state);
  return (
    <BaseButton
      size={size}
      color={color}
      buttonAttributes={{
        disabled,
        onClick,
      }}
    >
      {children}
    </BaseButton>
  );
}
