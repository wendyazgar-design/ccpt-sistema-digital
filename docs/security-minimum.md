* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f3f6fb;
  color: #14213d;
}

button, input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
}

.topbar {
  background: linear-gradient(135deg, #0f172a, #1d4ed8);
  color: white;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar h1 {
  margin: 0;
  font-size: 1.7rem;
}

.topbar p {
  margin: 4px 0 0;
  opacity: 0.8;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-box button {
  border: none;
  background: white;
  color: #0f172a;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.login-box {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 108px);
  padding: 24px;
}

.login-box form {
  width: min(420px, 100%);
  background: white;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.login-box h2 {
  margin-top: 0;
}

.login-box label {
  display: block;
  margin-top: 12px;
  font-weight: 600;
}

.login-box input {
  width: 100%;
  margin-top: 6px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
}

.login-box button, .panel button {
  margin-top: 18px;
  width: 100%;
  border: none;
  background: #0f172a;
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.message {
  margin-top: 16px;
  background: #ecfeff;
  color: #0f766e;
  border: 1px solid #99f6e4;
  padding: 10px 12px;
  border-radius: 8px;
}

.dashboard {
  display: grid;
  gap: 24px;
  padding: 32px;
}

.panel {
  background: white;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px;
}

.stat-card span {
  display: block;
  color: #64748b;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  font-size: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 18px;
}

th, td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
}

@media (max-width: 700px) {
  .topbar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .dashboard {
    padding: 20px;
  }
}
