import { SignoutButton } from "@/components/auth/signout-button";
import { LandingNavigation } from "@/components/landing/landing-navigation";
import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";

export default function ProfilePage() {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="min-h-dvh">
        <LandingNavigation />
        <section className="grid gap-5 px-5 py-16 sm:px-8 lg:px-14">
          <div className="rounded-[12px] border border-white/18 bg-white/12 p-6 backdrop-blur-[28px] sm:p-8">
            <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
              Profile
            </p>
            <h1 className="mt-4 text-[36px] font-normal leading-[1.1] tracking-[-0.03em] text-white">
              Student profile
            </h1>
            <p className="mt-4 max-w-[620px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
              Profile editing will be connected after the auth foundation. You
              can sign out from here now.
            </p>
            <div className="mt-8">
              <SignoutButton />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
