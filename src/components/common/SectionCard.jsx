function SectionCard({
  title,
  children,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <h3 className="mb-6 text-xl font-semibold text-white">
        {title}
      </h3>

      {children}

    </div>
  );
}

export default SectionCard;