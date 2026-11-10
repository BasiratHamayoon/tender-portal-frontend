"use client";

export default function EnvelopeTagPrint({ company, data }) {
  if (!company || !data) return null;

  const code = (company.shortName || company.code || "").toUpperCase();
  const isGL = code === "GL" || (company.name || "").toUpperCase().includes("GLOBAL LINKS");

  const displayAddress = data.fromAddress || company.address || 
    (isGL ? "GULISTAN KHAN HOUSE, 3RD FLOOR, 301-2, 82-E,\nFAZL-E-HUQ ROAD, BLUE AREA, ISLAMABAD" : "HOUSE NO. 1, STREET 45, F-8/1,\nISLAMABAD.");
  
  const displayPhone = data.phone || company.phone || (isGL ? "091-5711466" : "0345-8592229");
  const phoneLabel = isGL ? "TEL:" : "PH #";

  return (
    <div
      className="print-page bg-white text-black p-12 md:p-16 w-full max-w-[210mm] min-h-[297mm] mx-auto font-sans shadow-2xl print:shadow-none print:p-12 print:m-0 print:w-full print:min-h-0"
      style={{
        fontFamily: "'Calibri', Arial, sans-serif", // Both use Calibri for Envelopes
        fontSize: "20pt",
        lineHeight: 1.45,
        color: "#000",
      }}
    >
      {/* TO: Section */}
      <div className="space-y-3">
        <div className="font-bold text-[20pt]">TO:</div>
        <div className="pl-16 space-y-3 text-[20pt]">
          <div className="whitespace-pre-line font-bold uppercase">
            {data.addressedTo || "HQ FRONTIER CORPS, KP (South) D I Khan"}
          </div>
          {data.tenderNo && <div className="font-bold">Tender No. {data.tenderNo}</div>}
          {data.openingDate && <div className="font-bold uppercase">OPENING DATE: {data.openingDate}</div>}
        </div>
      </div>

      <div className="h-28 md:h-36" />

      {/* FROM: Section */}
      {isGL ? (
        <div className="space-y-2 text-[20pt]">
          <div className="font-bold">FROM:</div>
          <div className="pl-16 space-y-1 font-bold uppercase">
            <div className="underline">{company.name}</div>
            <div className="underline whitespace-pre-line">{displayAddress}</div>
            <div className="underline">{phoneLabel} {displayPhone}</div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-[20pt]">
          <div className="font-bold">
            FROM: <span className="underline uppercase">{company.name}</span>
          </div>
          <div className="pl-16 space-y-2 font-normal uppercase">
            <div className="whitespace-pre-line">{displayAddress}</div>
            {displayPhone && <div>{phoneLabel} {displayPhone}</div>}
          </div>
        </div>
      )}
    </div>
  );
}