"use client";

function getCode(company) {
  return (company?.shortName || company?.code || "").toUpperCase();
}

export default function ItemTagPrint({ company, data, proposalType = "FINANCIAL" }) {
  if (!company || !data) return null;

  const code = getCode(company);
  // Fonts from Word screenshots:
  // UIT + CI item tags → Calibri 14
  // GL item tags → Times New Roman 14
  const isGL = code === "GL";
  const fontFamily = isGL
    ? "'Times New Roman', Times, serif"
    : "'Calibri', Arial, sans-serif";

  const title = `${(proposalType || "FINANCIAL").toUpperCase()} PROPOSAL`;
  const specification =
    data.specification || "ORDNANCE STORES & ELECTRO MEDICAL EQUIPMENT –";
  const fiscalYear = data.fiscalYear || "FY 2026-27";
  const itemName = (data.itemName || "").toUpperCase();

  return (
    <div
      className="print-page bg-white text-black mx-auto"
      style={{
        fontFamily,
        fontSize: "14pt",
        color: "#000",
        border: "1.5px solid #000",
        padding: "28px 36px",
        maxWidth: "700px",
        minHeight: "220px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        lineHeight: 1.45,
        marginBottom: "24px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          {specification}
        </div>
        <div
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}
        >
          {fiscalYear}
        </div>
        <div
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            textTransform: "uppercase",
            marginTop: "8px",
            marginBottom: "8px",
          }}
        >
          {itemName}
        </div>
      </div>

      <div style={{ textAlign: "right", marginTop: "24px" }}>
        <span
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            textTransform: "uppercase",
          }}
        >
          {company.name}
        </span>
      </div>
    </div>
  );
}