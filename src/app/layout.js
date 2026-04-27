import "./globals.css";

export const metadata = {
  title: "Smart Park Admin",
  description: "מערכת ניהול חניה חכמה",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
