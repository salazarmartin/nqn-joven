import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function SelectInput(
  { options = [], className = "", isFocused = false, ...props },
  ref
) {
  const localRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus(),
  }));

  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <select
      {...props}
      
      className={
        "rounded-lg w-full px-3 py-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 " +
        className
      }
      ref={localRef}
    >
      <option value="" disabled>Seleccione</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id} {...props.value==opt.id? 'selected' : ''}>
          {opt.nombre}
        </option>
      ))}
    </select>
  );
});
