"use client";

function getCode(company) {
  return (company?.shortName || company?.code || "").toUpperCase();
}

export default function EnvelopeTagPrint({ company, data }) {
  if (!company || !data) return null;

  const code = getCode(company);
  const isGL = code === "GL";
  const isUIT = code === "UIT";

  const defaultAddress = isUIT
    ? "D-10, NEW SPINZAR IT TOWER UNIVERSITY\nROAD, PESHAWAR,"
    : isGL
    ? "GULISTAN KHAN HOUSE, 3RD FLOOR, 301-2, 82-E,\nFAZL-E-HUQ ROAD, BLUE AREA, ISLAMABAD"
    : "HOUSE NO. 1, STREET 45, F-8/1,\nISLAMABAD.";

  const defaultPhone = isUIT
    ? "091-5703025"
    : isGL
    ? "091-5711466"
    : "0345-8592229";

  const displayAddress = data.fromAddress || company.address || defaultAddress;
  const displayPhone = data.phone || company.phone || defaultPhone;

  // UIT & GL use TEL:; CI uses PH #
  const phoneLabel = isUIT || isGL ? "TEL:" : "PH #";

  // UIT + GL: underline FROM block (per Word screenshots)
  const underlineFrom = isUIT || isGL;

  return (
    <div
      className="print-page bg-white text-black p-12 md:p-16 w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-2xl print:shadow-none print:p-12 print:m-0 print:w-full print:min-h-0"
      style={{
        fontFamily: "'Calibri', Arial, sans-serif",
        fontSize: "20pt",
        lineHeight: 1.45,
        color: "#000",
      }}
    >
      {/* TO: */}
      <div className="space-y-3">
        <div className="font-bold text-[20pt]">TO:</div>
        <div className="pl-16 space-y-3 text-[20pt]">
          <div className="whitespace-pre-line font-bold uppercase">
            {data.addressedTo ||
              (isUIT
                ? "HQ FRONTIER CORPS, KP (SOUTH),\nD I KHAN"
                : "HQ FRONTIER CORPS, KP (South) D I Khan")}
          </div>
          {data.tenderNo && (
            <div className="font-bold">Tender No. {data.tenderNo}</div>
          )}
          {data.openingDate && (
            <div className="font-bold uppercase">
              OPENING DATE: {data.openingDate}
            </div>
          )}
        </div>
      </div>

      <div className="h-28 md:h-36" />

      {/* FROM: */}
      {isGL ? (
        // GLOBAL LINKS: FROM: on own line, then underlined name/address/tel
        <div className="space-y-2 text-[20pt]">
          <div className="font-bold">FROM:</div>
          <div className="pl-8 space-y-1 font-bold uppercase">
            <div className="underline">{company.name}</div>
            <div className="underline whitespace-pre-line">{displayAddress}</div>
            <div className="underline">
              {phoneLabel} {displayPhone}
            </div>
          </div>
        </div>
      ) : isUIT ? (
        // UNIVERSAL IT TRADERS: FROM: NAME same line, address+tel underlined
        <div className="space-y-2 text-[20pt] font-bold uppercase">
          <div>
            FROM: <span className="underline">{company.name}</span>
          </div>
          <div className="underline whitespace-pre-line">{displayAddress}</div>
          <div className="underline">
            {phoneLabel} {displayPhone}
          </div>
        </div>
      ) : (
        // CRIMSON default
        <div className="space-y-3 text-[20pt]">
          <div className="font-bold">
            FROM: <span className="underline uppercase">{company.name}</span>
          </div>
          <div className="pl-16 space-y-2 font-normal uppercase">
            <div className="whitespace-pre-line">{displayAddress}</div>
            {displayPhone && (
              <div>
                {phoneLabel} {displayPhone}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}