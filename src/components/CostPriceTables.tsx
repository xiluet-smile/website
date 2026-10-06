import { getContent, ui } from "@/lib/content-i18n";
import type { Locale } from "@/lib/i18n";

// Row rule inset 22px from the card edges, drawn per cell so the table stays a plain <table>.
const rule = "bg-[linear-gradient(rgba(222,213,194,.7),rgba(222,213,194,.7))] bg-no-repeat bg-[length:100%_1px]";

/** The published fee schedule: one real <table> per group from prices.json. */
export default function CostPriceTables({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale).cost;
  const { prices } = getContent(locale);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {prices.groups.map((g) => (
        <div key={g.n} className="glass-card flex flex-col overflow-hidden rounded-2xl lg:rounded-[18px]">
          <table className="w-full border-collapse text-left">
            <caption className="bg-[linear-gradient(150deg,rgba(10,62,68,.94),rgba(4,40,46,.92))] px-[22px] py-[18px] text-left text-on-dark">
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 flex-none place-items-center rounded-[10px] border border-[rgba(205,177,128,.4)] bg-[rgba(205,177,128,.18)] font-serif text-[15px] text-gold"
                >
                  {g.n}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-base leading-[1.55] font-semibold">{g.title}</span>
                  <span className="text-[13px] leading-[1.55] text-on-dark-muted">{g.sub}</span>
                </span>
              </span>
            </caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">{t.treatmentCol}</th>
                <th scope="col">{t.priceCol}</th>
              </tr>
            </thead>
            <tbody className="[&>tr:first-child>*]:pt-[18px]">
              {g.items.map((it) => (
                <tr key={it.name}>
                  <th
                    scope="row"
                    className={`${rule} bg-[position:22px_100%] py-3 pr-3 pl-[22px] align-baseline text-base leading-[1.55] font-normal text-ink`}
                  >
                    {it.name}
                  </th>
                  <td
                    className={`${rule} bg-[position:-22px_100%] py-3 pr-[22px] text-right align-baseline whitespace-nowrap`}
                  >
                    <span className="flex items-baseline justify-end gap-[7px]">
                      {it.was && <s className="font-serif text-base text-[#807b70]">{it.was}</s>}
                      <span className="font-serif text-[21px] leading-[1.55] text-teal">{it.price}</span>
                      {it.unit && <span className="text-xs text-muted">{it.unit}</span>}
                    </span>
                    {it.note && (
                      <span className="mt-0.5 block text-[11px] leading-[1.55] font-semibold whitespace-normal text-gold-text">
                        {it.note}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="m-0 mt-auto px-[22px] pt-[18px] pb-[18px] text-[13px] leading-[1.45] text-muted">{g.note}</p>
        </div>
      ))}
    </div>
  );
}
