import React from "react";
import Image from "next/image";

export const LandingFooter = () => {
  return (
    <footer className="noise-bg rounded-t-xl border bg-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Image
              src="/landing/cat-footer.png"
              alt="Comment.video"
              width={500}
              height={250}
              className="z-20 object-cover transition-all"
              style={{
                filter:
                  "grayscale(1) drop-shadow(4px 8px 32px rgba(0, 0, 0, 0.7))",
              }}
            />
          </div>
          <div>
            <p className="text-center text-3xl font-bold tracking-tighter">
              Help me buy boxes for my cat
            </p>
            <p className="text-center text-lg text-muted-foreground">
              my cat really loves boxes, please help me buy some
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="mt-8 flex w-full justify-center gap-8 text-sm">
              <a href="#" className="text-muted-foreground">
                Contact
              </a>
              <a href="#" className="text-muted-foreground">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground">
                Terms
              </a>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} comment.video. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
