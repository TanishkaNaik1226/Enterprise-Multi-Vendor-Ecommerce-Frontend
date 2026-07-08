function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <div className="mb-6">

      <label className="mb-2 block text-sm font-medium tracking-wide text-slate-300">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-2xl
          border
          border-white/10
          bg-white/5
          px-5
          py-4
          text-white
          placeholder:text-slate-500
          backdrop-blur-md
          transition-all
          duration-300
          outline-none
          hover:border-violet-400/30
          focus:border-violet-500
          focus:bg-white/10
          focus:ring-4
          focus:ring-violet-500/20
        "
      />
    </div>
  );
}

export default InputField;