import React from "react";
import "./Form.css";

const InputImage = ({ name, register, setValue, onChange, imagePreviews = [], removeImageAtIndex }) => (
  <div>
    <input
      type="file"
      accept="image/*"
      className="form-input"
      onChange={onChange}
      {...register(name)}
    />
    {imagePreviews.length > 0 && (
      <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {imagePreviews.map((src, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img
              src={src}
              alt="preview"
              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
            />
            <button
              type="button"
              onClick={() => removeImageAtIndex(i)}
              style={{
                position: "absolute", top: "-6px", right: "-6px",
                width: "20px", height: "20px", borderRadius: "50%",
                background: "#ef4444", color: "#fff", border: "none",
                cursor: "pointer", fontSize: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default InputImage;