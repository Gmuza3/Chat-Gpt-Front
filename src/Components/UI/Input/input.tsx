import { HtmlHTMLAttributes, forwardRef } from "react";

type Props = {
  label?: string;
  isError?: boolean;
  textError?: string;
  type?: string;
  placeHolder?: string;
  id?: string;
  readonly?:boolean
} & HtmlHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      placeHolder,
      type = "text",
      isError = false,
      textError = "",
      id,
      readonly,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col items-start gap-2 w-full z-50">
        <div className=''>
            {label && (
            <label htmlFor={id} className={`${'font-custom font-bold text-[16px] text-white'} ${isError ? 'text-red-400 font-custom font-bold text-[16px]' : ''}`}>
                {label} 
            </label>
            )}
        </div>
        <div className="flex flex-col gap-2 w-full">
        <input
          type={type}
          ref={ref}
          placeholder={placeHolder}
          id={id}
          readOnly={readonly}
          className='w-[100%] max-w-[400px] outline-none h-[56px] px-[18px] rounded-lg capitalize placeholder:text-slate-950 placeholder:font-custom placeholder:text-[14px] placeholder:tracking-tight placeholder:text-start'
          {...props}
        />
        {isError && <p className='text-red-400 font-custom font-normal font-500 text-[14px]'
        >{textError}</p>}
        </div>
      </div>
    );
  }
);

export default Input;
