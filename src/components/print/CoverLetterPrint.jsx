"use client";

function getCode(company) {
  return (company?.shortName || company?.code || "").toUpperCase();
}

export default function CoverLetterPrint({ data, company, letterheadHeight = 220 }) {
  if (!data || !company) return null;

  const code = getCode(company);
  const isGL = code === "GL";
  const isUIT = code === "UIT";
  const isCI = code === "CI" || (!isGL && !isUIT);

  const typeLabel = (data.type || "technical").toUpperCase(); // TECHNICAL | FINANCIAL
  const itemName = data.itemName || "[Item Name]";
  const dateStr = data.date || "";
  const addressedTo =
    data.addressedTo ||
    (isUIT
      ? "Headquarters Frontier Corps, KP (South), D I Khan"
      : isGL
      ? "Headquarter,\nFrontier Corps KP (South),\nD I Khan."
      : "The Chairman / Procurement Committee");

  // ═══════════════════════════════════════════════════════════
  // UNIVERSAL IT TRADERS — Cover letter for Technical/Financial Proposal
  // Font: Calibri / clean sans (matches UIT Word file tone)
  // ═══════════════════════════════════════════════════════════
  if (isUIT) {
    return (
      <div
        className="print-page bg-white text-black"
        style={{
          fontFamily: "'Calibri', Arial, sans-serif",
          fontSize: "12pt",
          color: "#000",
          background: "#fff",
          padding: "0 70px 60px 70px",
          minHeight: "297mm",
          lineHeight: 1.6,
        }}
      >
        <div style={{ height: `${letterheadHeight}px`, width: "100%" }} className="hidden print:block" />

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h1
            style={{
              fontSize: "14pt",
              fontWeight: "bold",
              textTransform: "uppercase",
              margin: 0,
              letterSpacing: "0.4px",
            }}
          >
            COVER LETTER FOR {typeLabel} PROPOSAL
          </h1>
        </div>

        <div style={{ textAlign: "right", marginBottom: "28px" }}>
          Dated: {dateStr}
        </div>

        <div style={{ marginBottom: "4px", fontWeight: "bold" }}>To,</div>
        <div style={{ marginBottom: "22px", whiteSpace: "pre-line" }}>{addressedTo}</div>

        <div style={{ marginBottom: "22px" }}>
          <span style={{ fontWeight: "bold" }}>Subject: </span>
          <span style={{ fontWeight: "bold", textDecoration: "underline", textTransform: "uppercase" }}>
            {typeLabel} BID FOR PROCUREMENT OF {itemName}
          </span>
        </div>

        <div style={{ marginBottom: "16px" }}>Dear Sir,</div>

        <div style={{ marginBottom: "16px", textAlign: "justify" }}>
          We hereby submit our {typeLabel.toLowerCase()} proposal for the{" "}
          <strong>Procurement of {itemName}</strong> in response to your tender invitation.
        </div>

        <div style={{ marginBottom: "16px", textAlign: "justify" }}>
          We trust that our submitted offer meets the requirements of the tender and look forward to
          the opportunity to provide the required items in accordance with the specified terms and
          conditions.
        </div>

        <div style={{ marginBottom: "28px" }}>Thank you for your consideration.</div>

        <div style={{ marginBottom: "56px" }}>Yours faithfully,</div>

        <div
          style={{
            borderTop: "1px solid #000",
            width: "180px",
            marginBottom: "8px",
          }}
        />
        <div style={{ fontWeight: "bold" }}>{company.name}</div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // GLOBAL LINKS — TECHNICAL / FINANCIAL PROPOSAL
  // Font: Times New Roman
  // ═══════════════════════════════════════════════════════════
  if (isGL) {
    return (
      <div
        className="print-page bg-white text-black"
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: "12pt",
          color: "#000",
          background: "#fff",
          padding: "0 70px 60px 70px",
          minHeight: "297mm",
          lineHeight: 1.65,
        }}
      >
        <div style={{ height: `${letterheadHeight}px`, width: "100%" }} className="hidden print:block" />

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "14pt",
              fontWeight: "bold",
              textDecoration: "underline",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {typeLabel} PROPOSAL
          </h1>
        </div>

        <div style={{ textAlign: "right", marginBottom: "28px", fontWeight: "bold" }}>
          Dated: - {dateStr}
        </div>

        <div style={{ marginBottom: "6px", fontWeight: "bold" }}>To</div>
        <div
          style={{
            marginBottom: "22px",
            marginLeft: "36px",
            whiteSpace: "pre-line",
            fontWeight: "bold",
          }}
        >
          {addressedTo}
        </div>

        <div style={{ marginBottom: "22px" }}>
          <span style={{ fontWeight: "bold" }}>Subject: </span>
          <span
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              textTransform: "uppercase",
            }}
          >
            QUOTATION FOR THE PURCHASE OF {itemName}
          </span>
        </div>

        <div style={{ marginBottom: "16px" }}>Dear Sir</div>

        <div style={{ marginBottom: "16px", textAlign: "justify" }}>
          We are pleased to present our {typeLabel.toLowerCase()} proposal for your review against
          the <strong>Tender Notice for the {itemName}</strong>.
        </div>

        <div style={{ marginBottom: "16px", textAlign: "justify" }}>
          We hope our offer is as per your expectations and looking forward to serve you at our best.
        </div>

        <div style={{ marginBottom: "28px", fontWeight: "bold" }}>
          Thanking and assuring you of our best services at all times, we remain.
        </div>

        <div style={{ marginBottom: "48px", fontWeight: "bold" }}>Best Regards,</div>
        <div style={{ fontWeight: "bold" }}>{company.name}</div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // CRIMSON INTERNATIONAL (default) — COVER LETTER FOR TENDER'S PROPOSAL
  // Font: Times New Roman italic title
  // ═══════════════════════════════════════════════════════════
  return (
    <div
      className="print-page bg-white text-black"
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: "12pt",
        color: "#000",
        background: "#fff",
        padding: "0 80px 70px 80px",
        minHeight: "297mm",
        lineHeight: 1.7,
      }}
    >
      <div style={{ height: `${letterheadHeight}px`, width: "100%" }} className="hidden print:block" />

      <div style={{ textAlign: "center", marginBottom: "45px" }}>
        <h1
          style={{
            fontSize: "14pt",
            textDecoration: "underline",
            fontWeight: "bold",
            fontStyle: "italic",
            margin: 0,
          }}
        >
          COVER LETTER FOR TENDER&rsquo;S PROPOSAL
        </h1>
      </div>

      <div style={{ textAlign: "right", marginBottom: "35px", fontWeight: "bold" }}>
        Dated: - {dateStr}
      </div>

      <div style={{ marginBottom: "12px", fontWeight: "bold" }}>To,</div>
      <div style={{ marginBottom: "25px", fontWeight: "bold", whiteSpace: "pre-line" }}>
        {addressedTo}
      </div>

      <div style={{ marginBottom: "25px", fontWeight: "bold" }}>Bid for {itemName}</div>

      <div style={{ marginBottom: "18px" }}>Dear Sir</div>

      <div style={{ marginBottom: "18px", textAlign: "justify" }}>
        We are pleased to present our proposal for your review against the{" "}
        <strong>Tender for the Procurement of {itemName}.</strong>
      </div>

      <div style={{ marginBottom: "25px", textAlign: "justify" }}>
        We hope our offer is as per your expectations and looking forward to serve you at our best.
      </div>

      <div style={{ marginBottom: "40px", fontWeight: "bold" }}>
        Thanking and assuring you of our best services at all times, we remain.
      </div>

      <div style={{ marginBottom: "60px", fontWeight: "bold" }}>Yours faithfully,</div>

      <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>{company.name}</div>
    </div>
  );
}