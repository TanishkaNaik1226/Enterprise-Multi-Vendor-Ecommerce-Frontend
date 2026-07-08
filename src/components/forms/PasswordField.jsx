import { useState } from "react";
import InputField from "./InputField";

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  name,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">

      <InputField
        label={label}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="
          absolute
          right-5
          top-[3.15rem]
          text-sm
          font-medium
          text-violet-300
          hover:text-violet-200
        "
      >
        {showPassword ? "Hide" : "Show"}
      </button>

    </div>
  );
}

export default PasswordField;