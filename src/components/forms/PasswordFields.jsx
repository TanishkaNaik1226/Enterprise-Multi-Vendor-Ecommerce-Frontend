import InputField from "./InputField";

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
}) {
  return (
    <InputField
      label={label}
      type="password"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default PasswordField;