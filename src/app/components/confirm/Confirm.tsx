import {
  DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS,
  ReactNode,
} from "react";
import "./confirm.module.css";

type ConfirmProps = {
  children: ReactNode;
  onConfirm: DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS];
  buttonText: string;
  confirmText?: string;
  cancelText?: string;
};

export function Confirm({
  children,
  onConfirm,
  buttonText,
  confirmText,
  cancelText,
}: ConfirmProps) {
  const id = Math.random().toString();
  return (
    <>
      {/* @ts-expect-error */}
      <button popovertarget={id} type="button">
        {buttonText}
      </button>
      {/* @ts-expect-error */}
      <div popover="auto" id={id}>
        {children}
        <button
          /* @ts-expect-error */
          popovertarget={id}
          popovertargetaction="hide"
          type="button"
        >
          {cancelText ?? "Cancel"}
        </button>
        <form action={onConfirm}>
          <input type="submit" value={confirmText ?? "Confirm"} />
        </form>
      </div>
    </>
  );
}
