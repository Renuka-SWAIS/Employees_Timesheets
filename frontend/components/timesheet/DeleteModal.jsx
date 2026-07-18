"use client";

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2>Delete Timesheet</h2>

        <p style={{ margin: "20px 0" }}>
          Are you sure you want to delete this entry?
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#6b7280",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#dc2626",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}