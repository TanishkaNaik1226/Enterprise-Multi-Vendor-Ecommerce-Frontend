function PrimaryButton({
  text,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-4xl
        bg-linear-to-r
        from-violet-600
        via-purple-600
        to-blue-600
        px-6
        py-4
        text-base
        font-semibold
        text-white
        shadow-lg
        shadow-violet-900/30
        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:shadow-xl
        hover:shadow-violet-500/30

        active:scale-[0.98]

        focus:outline-none
        focus:ring-4
        focus:ring-violet-500/30

        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {/* Shine Effect */}
      <span
        className="
          absolute
          inset-0
          -translate-x-full
          bg-linear-to-r
          from-transparent
          via-white/20
          to-transparent
          transition-transform
          duration-700
          group-hover:translate-x-full
        "
      />

      <span className="relative z-10">
        {text}
      </span>
    </button>
  );
}

export default PrimaryButton;