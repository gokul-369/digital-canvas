import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Development middleware to handle /api/contact requests locally
 * in Vite without requiring a separate serverless dev runtime.
 */
function contactDevApiPlugin(): Plugin {
  return {
    name: "contact-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/contact" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });

          req.on("end", async () => {
            try {
              const { name, email, message, idea } = JSON.parse(body || "{}");

              if (!name || !email || !message || !idea) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing fields" }));
                return;
              }

              const env = loadEnv("development", process.cwd(), "");
              const apiKey = process.env.RESEND_API_KEY || env.RESEND_API_KEY;

              if (apiKey) {
                const { Resend } = await import("resend");
                const resend = new Resend(apiKey);
                await resend.emails.send({
                  from: "Gokul — Portfolio <onboarding@resend.dev>",
                  to: ["gokul369@outlook.com"],
                  subject: `Need some insights on ${idea}`,
                  replyTo: email,
                  html: `
                    <div style="font-family: system-ui; line-height:1.6">
                      <h2>New Contact Message</h2>
                      <p><b>Name:</b> ${name}</p>
                      <p><b>Email:</b> ${email}</p>
                      <p><b>Topic / Idea:</b> ${idea}</p>
                      <p><b>Message:</b></p>
                      <p>${message}</p>
                    </div>
                  `,
                });
              } else {
                console.warn("[contact-api] RESEND_API_KEY not configured, mocking success in dev.");
              }

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ emailSent: true }));
            } catch (err: unknown) {
              const error = err as Error;
              console.error("[contact-api] Error sending email:", error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: error?.message || "Email failed" }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    contactDevApiPlugin(),
  ],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          gsap: ["gsap", "gsap/ScrollTrigger"],
          motion: ["motion"],
        },
      },
    },
  },
});
