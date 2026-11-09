"use client";

export default function ItemTagPrint({ data, company }) {
  if (!data || !company) return null;

  const isFinancial = data.tagType === "item-financial";
  const proposalType = isFinancial ? "FINANCIAL PROPOSAL" : "TECHNICAL PROPOSAL";

  return (
    <div style={{ fontFamily: "Calibri, sans-serif", color: "#000", background: "#fff", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
      <div style={{ border: "2px solid #000", padding: "40px 50px", textAlign: "center", width: "100%", maxWidth: "600px" }}>
        <p style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>{proposalType}</p>
        <p style={{ fontSize: 14, fontWeight: "bold", textDecoration: "underline", marginBottom: 20 }}>
          {data.specificationNumber ? `SPECIFICATION – ${data.specificationNumber}` : `PROCUREMENT ${new Date().getFullYear()}`}
        </p>
        <p style={{ fontSize: 14, fontWeight: "bold", textDecoration: "underline", marginBottom: 30, textTransform: "uppercase" }}>
          {data.itemName}
        </p>
        <p style={{ fontSize: 14, fontWeight: "bold", textDecoration: "underline", textAlign: "right", textTransform: "uppercase" }}>
          {company.name}
        </p>
      </div>
    </div>
  );
}