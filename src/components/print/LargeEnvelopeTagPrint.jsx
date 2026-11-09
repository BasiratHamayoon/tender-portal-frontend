"use client";

export default function LargeEnvelopeTagPrint({ data, company }) {
  if (!data || !company) return null;

  const isFinancial = data.tagType === "large-envelope-financial" || data.tagType === "main-envelope";
  const isMain = data.tagType === "main-envelope";

  let offerType = "TECHNICAL OFFER";
  if (data.tagType === "large-envelope-financial") offerType = "FINANCIAL OFFER";
  if (data.tagType === "main-envelope") offerType = "TENDER OFFER";

  return (
    <div style={{ fontFamily: "Calibri, sans-serif", color: "#000", background: "#fff", padding: "60px 80px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {data.addressedTo && (
        <div style={{ marginBottom: 30 }}>
          <p style={{ fontSize: 20, fontWeight: "bold" }}>TO:</p>
          <p style={{ fontSize: 20, fontWeight: "bold", marginLeft: 40, textTransform: "uppercase", marginTop: 10 }}>{data.addressedTo}</p>
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: 40, marginTop: 20 }}>
        <p style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>{offerType}</p>
        {data.tenderNumber && (
          <p style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>{data.tenderNumber}</p>
        )}
        {data.openingDate && (
          <p style={{ fontSize: 20, fontWeight: "bold" }}>
            OPENING DATE: {data.openingDate}
          </p>
        )}
      </div>

      <div style={{ marginTop: 60 }}>
        <p style={{ fontSize: 20, fontWeight: "bold" }}>
          FROM: <span style={{ textDecoration: "underline" }}>{company.name}</span>
        </p>
        <p style={{ fontSize: 18, marginTop: 10, marginLeft: 60 }}>{company.address}</p>
        <p style={{ fontSize: 18, marginLeft: 60 }}>{company.city}</p>
        <p style={{ fontSize: 18, marginTop: 15, marginLeft: 60 }}>PH # {company.phone}</p>
      </div>
    </div>
  );
}