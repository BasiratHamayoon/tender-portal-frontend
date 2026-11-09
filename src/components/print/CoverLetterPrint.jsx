"use client";

export default function CoverLetterPrint({ data, company }) {
  if (!data || !company) return null;

  const isTechnical = data.type === "technical";
  const proposalType = isTechnical ? "TECHNICAL" : "FINANCIAL";

  return (
    <div className="print-page" style={{ fontFamily: company.fontFamily || "Times New Roman", fontSize: company.fontSize || 12, color: "#000", background: "#fff", padding: "60px 70px", minHeight: "100vh", lineHeight: 1.8 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: 14, textDecoration: "underline", fontWeight: "bold", fontStyle: "italic" }}>
          COVER LETTER FOR TENDER&apos;s PROPOSAL
        </h2>
      </div>

      <div style={{ textAlign: "right", marginBottom: 30 }}>
        <p style={{ fontWeight: "bold" }}>Dated: - {data.date}</p>
      </div>

      <div style={{ marginBottom: 10 }}>
        <p style={{ fontWeight: "bold" }}>To,</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontWeight: "bold" }}>{data.addressedTo}.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontWeight: "bold" }}>Bid for {data.itemName}</p>
      </div>

      <div style={{ marginBottom: 15 }}>
        <p>Dear Sir</p>
      </div>

      <div style={{ marginBottom: 15, textAlign: "justify" }}>
        <p>
          We are pleased to present our proposal for your review against the{" "}
          <strong>Tender for the Procurement of {data.itemName}.</strong>
        </p>
      </div>

      <div style={{ marginBottom: 20, textAlign: "justify" }}>
        <p>We hope our offer is as per your expectations and looking forward to serve you at our best.</p>
      </div>

      <div style={{ marginBottom: 30 }}>
        <p style={{ fontWeight: "bold" }}>Thanking and assuring you of our best services at all times, we remain.</p>
      </div>

      <div style={{ marginBottom: 10 }}>
        <p style={{ fontWeight: "bold" }}>Yours faithfully,</p>
      </div>

      <div style={{ marginTop: 60 }}>
        <p style={{ fontWeight: "bold", textTransform: "uppercase" }}>{company.name}</p>
      </div>
    </div>
  );
}