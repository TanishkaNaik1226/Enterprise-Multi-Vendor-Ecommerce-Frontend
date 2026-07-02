function PrimaryButton({ text, type = "button" }) {
  return (
    <button
      type={type}
      className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200"
    >
      {text}
    </button>
  );
}

export default PrimaryButton;