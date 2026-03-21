import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "hsl(var(--primary))" }}
      />

      <div className="relative text-center px-6">
        <p
          className="font-bold leading-none select-none"
          style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(6rem, 20vw, 10rem)",
            background:
              "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.3))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </p>

        <h1
          className="mt-2 text-2xl font-semibold"
          style={{ color: "hsl(var(--foreground))", fontFamily: "Montserrat, sans-serif" }}
        >
          Страница не найдена
        </h1>

        <p
          className="mt-3 text-sm max-w-xs mx-auto"
          style={{ color: "hsl(var(--foreground) / 0.5)" }}
        >
          Возможно, адрес изменился или страница была удалена.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--background))",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
