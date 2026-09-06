"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowUpToLine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useImportProfileToResume,
  useSyncProfileFromResume,
} from "@/lib/queryHooks/careerProfileHooks";
import type { ImportableSection } from "@/lib/types/careerProfileTypes";

const ALL_SECTIONS: ImportableSection[] = [
  "personal",
  "summary",
  "experience",
  "education",
  "skills",
];

const ProfileSyncActions = ({ resumeId }: { resumeId: string }) => {
  const [confirmingImport, setConfirmingImport] = useState(false);

  const { mutate: importProfile, isPending: isImporting } =
    useImportProfileToResume(resumeId);
  const { mutate: syncProfile, isPending: isSyncing } =
    useSyncProfileFromResume();

  // Importing replaces what is already in the resume, so it asks first rather
  // than overwriting the user's work on a single click.
  if (confirmingImport) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-600">
          Replace this resume&apos;s content with your career profile?
        </span>
        <Button
          size="sm"
          variant="destructive"
          disabled={isImporting}
          onClick={() => {
            importProfile(
              { resumeId, sections: ALL_SECTIONS },
              { onSettled: () => setConfirmingImport(false) }
            );
          }}
        >
          {isImporting && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
          Replace
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setConfirmingImport(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="flex gap-1.5"
        onClick={() => setConfirmingImport(true)}
      >
        <ArrowDownToLine className="h-3.5 w-3.5" />
        Import from profile
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="flex gap-1.5"
        disabled={isSyncing}
        onClick={() => syncProfile(resumeId)}
      >
        {isSyncing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ArrowUpToLine className="h-3.5 w-3.5" />
        )}
        Save to career profile
      </Button>
    </div>
  );
};

export default ProfileSyncActions;
