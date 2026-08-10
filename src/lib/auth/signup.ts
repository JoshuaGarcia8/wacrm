import type { SupabaseClient } from "@supabase/supabase-js";

export interface SignupUserInput {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignupCreateResult {
  created: boolean;
  existing: boolean;
  user?: { id: string; email: string | null };
  error?: { message: string; code?: string };
}

export async function createConfirmedSupabaseUser(
  adminClient: Pick<SupabaseClient, "auth">,
  input: SignupUserInput,
): Promise<SignupCreateResult> {
  const { data, error } = await adminClient.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      full_name: input.fullName ?? "",
    },
  });

  if (error) {
    const message = error.message ?? "Unable to create account";
    const normalized = message.toLowerCase();

    if (normalized.includes("already") || normalized.includes("exists")) {
      return {
        created: false,
        existing: true,
        error: { message, code: String(error.status ?? "") },
      };
    }

    return {
      created: false,
      existing: false,
      error: { message, code: String(error.status ?? "") },
    };
  }

  return {
    created: true,
    existing: false,
    user: {
      id: data.user?.id ?? "",
      email: data.user?.email ?? input.email,
    },
  };
}
