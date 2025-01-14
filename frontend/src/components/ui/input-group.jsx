import { Input } from "./input";
import { Label } from "./label";

export default function InputGroup({
  className,
  label,
  placeholder,
  error,
  optional = false,
  type = "text",
  compareValue = "",
  prefix,
  onChange,
  value,
  ...props
}) {
  const handleChange = (e) => {
    if (typeof onChange === "function") {
      if (compareValue) {
        onChange(compareValue + e.target.value.replace(/^08/, ""));
      } else {
        onChange(e);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <Label>
        {label}{" "}
        {optional === true && (
          <span className="text-xs text-gray-500">(Optional)</span>
        )}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="absolute text-sm -translate-y-1/2 left-3 top-1/2">
            {prefix}
          </span>
        )}
        <Input
          placeholder={placeholder}
          type={type}
          value={value || ""}
          onChange={handleChange}
          className={prefix ? "pl-9" : ""}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
