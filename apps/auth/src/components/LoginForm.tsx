import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", email);
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h3>Auth Micro-Frontend (Remote)</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button
          type="submit"
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          {" "}
          Giriş Yap{" "}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
