import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, Loader2, Lock, ShieldCheck } from "lucide-react";
import React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAccountDialog({
  open,
  onOpenChange,
}: CreateAccountDialogProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";
  const isAuthenticated = !!identity;

  const handleLogin = async () => {
    try {
      await login();
      onOpenChange(false);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md flex flex-col overflow-hidden"
        style={{ zIndex: 99999, maxHeight: "85vh" }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">Create Account / Login</DialogTitle>
          <DialogDescription className="sr-only">
            Learn about Internet Identity and create your account
          </DialogDescription>
        </DialogHeader>

        <div
          className="flex-1 space-y-4 py-2 pr-1"
          style={{ overflowY: "auto" }}
        >
          <p className="text-sm text-foreground leading-relaxed">
            The <strong>VTH Guest Book: Vicarious Thru-Hiker</strong> runs on
            the <strong>Internet Computer</strong> &#8212; a decentralized
            blockchain network that hosts apps and data without traditional
            servers or cloud providers.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Internet Identity
                </p>
                <p className="text-xs text-muted-foreground">
                  Your account uses <strong>Internet Identity</strong> &#8212; a
                  secure, passwordless authentication system. No email, no
                  password, no personal data collected.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Private by Design
                </p>
                <p className="text-xs text-muted-foreground">
                  Your identity is cryptographically secured using your
                  device&#39;s biometrics or security key. No one can
                  impersonate you or access your account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Decentralized &amp; Permanent
                </p>
                <p className="text-xs text-muted-foreground">
                  Your guestbook entries are stored on-chain &#8212; no company
                  can delete them or shut down the service. The trail lives on
                  forever.
                </p>
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="bg-muted rounded-lg px-4 py-3 text-sm text-center text-foreground">
              &#x2705; You are already logged in!
            </div>
          ) : (
            <Button
              className="w-full mt-2"
              onClick={handleLogin}
              disabled={isLoggingIn}
              data-ocid="createaccount.submit_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting&#8230;
                </>
              ) : (
                "&#x1F511; Login / Create Identity"
              )}
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center">
            First time? Internet Identity will guide you through creating a
            secure identity using your device&#39;s built-in authentication.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
