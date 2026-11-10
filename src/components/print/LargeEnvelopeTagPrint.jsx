"use client";

export default function EnvelopeTagPrint({ data, company }) {
  if (!data || !company) return null;

  return (
    <div
      style={{
        fontFamily: `"${company.tagFont}", sans-serif`,
        color: "#000",
        background: "#fff",
        padding: "60px 80px",
        minHeight: "297mm",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TO section */}
      <div style={{ marginBottom: "60px" }}>
        <p style={{ fontSize: "20pt", fontWeight: "bold", margin: "0 0 16px 0" }}>
          TO:
        </p>
        <p style={{
          fontSize: "20pt",
          fontWeight: "bold",
          marginLeft: "40px",
          textTransform: "uppercase",
          margin: "0 0 0 40px",
          lineHeight: 1.4,
        }}>
          {data.addressedTo}
        </p>
        {data.tenderNumber && (
          <p style={{
            fontSize: "20pt",
            fontWeight: "bold",
            marginLeft: "40px",
            marginTop: "24px",
            margin: "24px 0 0 40px",
          }}>
            Tender No. {data.tenderNumber}
          </p>
        )}
        {data.openingDate && (
          <p style={{
            fontSize: "20pt",
            fontWeight: "bold",
            marginLeft: "40px",
            marginTop: "12px",
            margin: "12px 0 0 40px",
          }}>
            OPENING DATE: {data.openingDate}
          </p>
        )}
      </div>

      {/* Big centered label */}
      <div style={{ textAlign: "center", margin: "60px 0" }}>
        <p style={{ fontSize: "28pt", fontWeight: "bold", margin: 0 }}>
          {data.label}
        </p>
      </div>

      {/* Bottom company info */}
      <div style={{ marginTop: "auto" }}>
        <p style={{ fontSize: "20pt", fontWeight: "bold", margin: "0 0 12px 0" }}>
          FROM: <span style={{ textDecoration: "underline" }}>{company.name}</span>
        </p>
        <p style={{ fontSize: "18pt", margin: "0 0 6px 60px" }}>{company.address}</p>
        <p style={{ fontSize: "18pt", margin: "0 0 12px 60px" }}>{company.city}</p>
        <p style={{ fontSize: "18pt", margin: "0 0 0 60px" }}>PH # {company.phone}</p>
      </div>
    </div>
  );
}