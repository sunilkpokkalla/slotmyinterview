import "server-only";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AuthError } from "./auth";

export type ActionResult<T = undefined> = { ok: true; data: T; message?: string } | { ok: false; error: string };

export class UserError extends Error {}

/** Runs a server action body and converts expected failures into a serializable result. */
export async function runAction<T>(fn: () => Promise<T>, message?: string): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data, message };
  } catch (err) {
    if (err instanceof AuthError || err instanceof UserError) return { ok: false, error: err.message };
    if (err instanceof ZodError) return { ok: false, error: err.issues.map((i) => i.message).join(". ") };
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") return { ok: false, error: "That value is already taken." };
      if (err.code === "P2025") return { ok: false, error: "Not found." };
    }
    // Re-throw framework control flow (redirect(), notFound()).
    if (err && typeof err === "object" && "digest" in err && typeof (err as { digest: unknown }).digest === "string" && String((err as { digest: string }).digest).startsWith("NEXT_")) {
      throw err;
    }
    console.error("[action] unexpected error", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
