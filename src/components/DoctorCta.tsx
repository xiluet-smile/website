import Link from "next/link";

/** Closing dark panel with the free photo evaluation card (doctors index and profiles). */
export default function DoctorCta({
  heading,
  text,
  wideButton = false,
}: {
  heading: string;
  text: string;
  /** Profiles use a full-width button; the index keeps it at content width on desktop. */
  wideButton?: boolean;
}) {
  return (
    <section className="wrap py-16 lg:py-28">
      <div className="dark-panel grid items-center gap-8 rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(247,244,238,.18),0_30px_80px_rgba(4,40,46,.32)] lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:rounded-[20px] lg:p-16">
        <div className="flex flex-col gap-5">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal text-pretty lg:text-[52px] lg:leading-[1.08]">
            {heading}
          </h2>
          <p className="m-0 text-[17px] text-on-dark-muted lg:text-[19px]">{text}</p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-[rgba(255,255,255,.8)] bg-[rgba(247,244,238,.9)] p-6 text-ink lg:p-8">
          <p className="m-0 font-serif text-[22px] leading-[1.55] lg:text-2xl lg:leading-[1.55]">Free photo evaluation</p>
          <p className="m-0 text-[15px] text-body">Photos of your smile, from your phone. Takes 2 minutes.</p>
          <Link
            href="/free-photo-evaluation"
            className={`btn btn-teal h-[52px] w-full px-[26px] text-[17px] ${wideButton ? "mt-2" : "lg:w-auto lg:self-start"}`}
          >
            Start my evaluation
          </Link>
        </div>
      </div>
    </section>
  );
}
