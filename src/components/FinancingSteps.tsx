type Step = { n: string; t: string; d?: string };

/**
 * Numbered three-step row. With a description the title is a serif heading
 * (financing index); without one the title is the body line (partner pages).
 */
export default function FinancingSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="m-0 grid list-none gap-4 p-0 lg:grid-cols-3">
      {steps.map((st) => (
        <li
          key={st.n}
          className={`glass-card flex flex-col gap-3.5 rounded-2xl p-6 lg:rounded-[18px] lg:p-7 ${st.d ? "lg:min-h-[200px]" : "lg:min-h-[150px]"}`}
        >
          <span className="text-xs font-semibold tracking-[.14em] text-muted lg:text-hint">{st.n}</span>
          {st.d ? (
            <>
              <h3 className="m-0 font-serif text-[22px] leading-[1.2] font-normal text-teal lg:text-2xl">{st.t}</h3>
              <p className="m-0 text-[15px] leading-normal text-body">{st.d}</p>
            </>
          ) : (
            <p className="m-0 text-[17px] leading-normal text-ink">{st.t}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
