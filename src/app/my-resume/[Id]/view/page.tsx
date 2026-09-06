"use client";
import Image from "next/image";
import { axios } from "@/lib/config";
import PreviewSection from "@/components/custom/ResumeEdit/PreviewSection";
import SharePageLoader from "@/components/custom/SharePageLoader";
import { Button } from "@/components/ui/button";
import { ResumeInfoProvider } from "@/context/ResumeInfoContext";
import {
  useGetResumeById,
  useSetResumeVisibility,
} from "@/lib/queryHooks/resumeHooks";
import { FileDown, Globe, Loader2, Lock, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RWebShare } from "react-web-share";

function ResumeView() {
  const params = useParams<{ Id: string }>();
  const { isError, isLoading, data } = useGetResumeById(params?.Id);
  const [resumeInfo, setResumeInfo] = useState(data);

  const { mutate: setVisibility, isPending: isVisibilityPending } =
    useSetResumeVisibility(params?.Id);

  // Ownership comes from the server. Being signed in is not the same as owning
  // this resume — a signed-in visitor can be viewing someone else's.
  const isOwner = Boolean(resumeInfo?.isOwner);
  const isPublic = Boolean(resumeInfo?.isPublic);

  useEffect(() => {
    setResumeInfo(data);
  }, [data]);

  const [qr, setQr] = useState("");
  useEffect(() => () => { if (qr) URL.revokeObjectURL(qr); }, [qr]);
  const [slug, setSlug] = useState("");
  const [downloading, setDownloading] = useState(false);
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await axios.get(`resume/${params.Id}/pdf`, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "resume.pdf"; anchor.click(); URL.revokeObjectURL(url);
    } catch { toast.error("Could not export PDF. Please try again."); }
    finally { setDownloading(false); }
  };
  if (isError) return <p role="alert" className="p-8 text-center">This resume is private, unavailable, or could not be loaded.</p>;
  return (
    <ResumeInfoProvider>
      <div className="flex flex-col w-full">
        {isLoading && !isError ? (
          <SharePageLoader />
        ) : (
          <>
            <div
              id="no-print-area"
              className="my-10 md:mx-20 lg:mx-36 max-sm:w-full"
            >
              <h2 className="text-center text-2xl font-medium max-sm:px-4">
                {isOwner
                  ? "Your"
                  : `${resumeInfo?.firstName} ${resumeInfo?.lastName}`}{" "}
                resume is ready for download and sharing.
              </h2>
              <p className="text-center text-gray-400 max-sm:px-4 max-sm:pt-2">
                You can now download{" "}
                {isOwner
                  ? "your"
                  : `${resumeInfo?.firstName} ${resumeInfo?.lastName}`}{" "}
                resume and share the unique URL with potential employers and
                professional networks.
              </p>

              {isOwner && <div className="mx-6 mt-6 rounded-lg border p-4"><label className="text-sm">Public URL slug<input aria-label="Public URL slug" className="mx-2 rounded border p-2" value={slug || resumeInfo?.publicSlug || ""} onChange={e => setSlug(e.target.value)}/></label><Button variant="outline" onClick={async () => { try { await axios.patch(`resume/${params.Id}/slug`, { slug }); setResumeInfo({ ...resumeInfo, publicSlug: slug }); toast.success("Public URL saved"); } catch { toast.error("Choose a unique slug using lowercase letters, numbers and hyphens."); } }}>Save URL</Button>{resumeInfo?.publicSlug && <p className="mt-3 text-sm">Public URL: /u/{resumeInfo.publicSlug} · Views: {resumeInfo.publicViews ?? 0}</p>}</div>}
              {isOwner && (
                <div className="mx-6 lg:mx-44 mt-8 rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3">
                      {isPublic ? (
                        <Globe className="mt-0.5 h-5 w-5 text-primary" />
                      ) : (
                        <Lock className="mt-0.5 h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {isPublic ? "Public link is on" : "This resume is private"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {isPublic
                            ? "Anyone with the link can view this resume."
                            : "Only you can see it. Turn on the public link to share it."}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant={isPublic ? "outline" : "default"}
                      disabled={isVisibilityPending}
                      onClick={() =>
                        setVisibility({
                          id: params?.Id,
                          isPublic: !isPublic,
                        })
                      }
                      className="flex gap-2"
                    >
                      {isVisibilityPending && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {isPublic ? "Make private" : "Make public"}
                    </Button>
                  </div>
                </div>
              )}

              {isOwner && isPublic && <div className="mx-6 mt-4"><Button variant="outline" onClick={async () => { try { const response = await axios.get(`resume/${params.Id}/qr`, { responseType: "blob" }); setQr(URL.createObjectURL(response.data)); } catch { toast.error("Could not create QR code"); } }}>Create share QR code</Button>{qr && <a href={qr} download="resume-qr.png"><Image unoptimized src={qr} width={256} height={256} alt="QR code linking to this public resume"/></a>}</div>}
              <div className="flex justify-between lg:px-44 px-6 my-10 items-center">
                <Button
                  disabled={isLoading || downloading}
                  id="downloadButton"
                  onClick={handleDownload}
                  className="flex gap-2"
                >
                  <FileDown size={18} />
                  {downloading ? "Preparing PDF..." : "Download PDF"}
                </Button>

                {isOwner && !isPublic ? (
                  // Sharing a link that recipients would get a 404 from is worse
                  // than not offering the button at all.
                  <Button
                    className="flex gap-2"
                    variant="secondary"
                    onClick={() =>
                      toast.error(
                        "Turn on the public link first, otherwise recipients can't open it."
                      )
                    }
                  >
                    Share <Share2 size={18} />
                  </Button>
                ) : (
                  <RWebShare
                    data={{
                      text: "Please find the link to my resume below for your review:",
                      url: resumeInfo?.publicSlug ? `${process.env.NEXT_PUBLIC_BASE_URL}/u/${resumeInfo.publicSlug}` : `${process.env.NEXT_PUBLIC_BASE_URL}/my-resume/${params?.Id}/view`,
                      title: `${resumeInfo?.firstName} ${resumeInfo?.lastName}`,
                    }}
                    onClick={() => toast.success("shared successfully!")}
                  >
                    <Button disabled={isLoading} className="flex gap-2">
                      Share <Share2 color="#fff" size={18} />
                    </Button>
                  </RWebShare>
                )}
              </div>
            </div>

            <div
              id="print-area"
              className={
                "my-10 md:w-[60%] max-sm:w-full flex justify-center self-center"
              }
            >
              <PreviewSection />
            </div>
          </>
        )}
      </div>
    </ResumeInfoProvider>
  );
}

export default ResumeView;
