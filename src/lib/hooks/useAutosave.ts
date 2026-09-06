"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserResume } from "../queries/resumeCRUD";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

// Only the resume's own writable fields. The context object also carries
// server-side extras such as isOwner and isPublic, which are not editable here.
const AUTOSAVE_FIELDS = [
  "firstName",
  "lastName",
  "jobTitle",
  "address",
  "phone",
  "email",
  "themeColor",
  "summary",
  "experience",
  "education",
  "skills",
] as const;

const pickSaveableFields = (data: any): Record<string, unknown> | null => {
  if (!data) return null;
  const out: Record<string, unknown> = {};
  for (const field of AUTOSAVE_FIELDS) {
    if (data[field] !== undefined) out[field] = data[field];
  }
  return Object.keys(out).length > 0 ? out : null;
};

export const useAutosave = ({
  id,
  data,
  delay = 1500,
}: {
  id?: string;
  data: any;
  delay?: number;
}): SaveStatus => {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const lastSavedRef = useRef<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: updateUserResume,
    onSuccess: (_res, variables) => {
      lastSavedRef.current = JSON.stringify(variables.formData);
      setStatus("saved");
    },
    // Deliberately no toast: autosave runs on a timer, and a failing network
    // would otherwise produce a stream of them. The status line reports it once.
    onError: () => setStatus("error"),
  });

  useEffect(() => {
    const payload = pickSaveableFields(data);
    if (!id || !payload) return;

    const serialized = JSON.stringify(payload);

    // The first payload after load is the server's own copy, so there is
    // nothing to write back.
    if (lastSavedRef.current === null) {
      lastSavedRef.current = serialized;
      return;
    }

    if (serialized === lastSavedRef.current) return;

    setStatus("saving");
    const timer = setTimeout(() => mutate({ formData: payload, id }), delay);
    return () => clearTimeout(timer);
  }, [data, id, delay, mutate]);

  return status;
};
