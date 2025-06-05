"use client";

import { useState, useEffect } from "react";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import Confetti from "react-dom-confetti";

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    shareASaleToken: string;
    shareASaleSecretKey: string;
    awinKey: string;
    impactKey: string;
    everflowKey: string;
    cjKey: string;
    rakutenKey: string;
    rakutenSecret: string;
    partnerizeKey: string;
  };
}

type FieldKey = keyof ApiKeysModalProps['initialData'] | 'shareasale' | 'rakuten';

interface Field {
  key: FieldKey;
  label: string;
  isMultiField?: boolean;
}

export function ApiKeysModal({ isOpen, onClose, initialData }: ApiKeysModalProps) {
  const [formData, setFormData] = useState({
    shareASaleToken: initialData.shareASaleToken || "",
    shareASaleSecretKey: initialData.shareASaleSecretKey || "",
    awinKey: initialData.awinKey || "",
    impactKey: initialData.impactKey || "",
    everflowKey: initialData.everflowKey || "",
    cjKey: initialData.cjKey || "",
    rakutenKey: initialData.rakutenKey || "",
    rakutenSecret: initialData.rakutenSecret || "",
    partnerizeKey: initialData.partnerizeKey || ""
  });
  const [currentField, setCurrentField] = useState<FieldKey | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fields: Field[] = [
    { key: "shareasale", label: "ShareASale API Credentials", isMultiField: true },
    { key: "awinKey", label: "Awin API Key" },
    { key: "impactKey", label: "Impact API Key" },
    { key: "everflowKey", label: "Everflow API Key" },
    { key: "cjKey", label: "Commission Junction API Key" },
    { key: "rakuten", label: "Rakuten API Credentials", isMultiField: true },
    { key: "partnerizeKey", label: "Partnerize API Key" },
  ];

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/organization/update-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update API keys");
      }

      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error updating API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: keyof ApiKeysModalProps['initialData'], value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit API Keys</DialogTitle>
          <DialogDescription>
            Update your affiliate network API keys
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Confetti active={showConfetti} config={confettiConfig} />
          {currentField ? (
            <div className="space-y-4">
              {currentField === 'shareasale' ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="shareASaleToken">API Token</Label>
                      <Input
                        id="shareASaleToken"
                        value={formData.shareASaleToken}
                        onChange={(e) => handleFieldChange('shareASaleToken', e.target.value)}
                        placeholder="Enter ShareASale API Token"
                        type="password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shareASaleSecretKey">API Secret Key</Label>
                      <Input
                        id="shareASaleSecretKey"
                        value={formData.shareASaleSecretKey}
                        onChange={(e) => handleFieldChange('shareASaleSecretKey', e.target.value)}
                        placeholder="Enter ShareASale API Secret Key"
                        type="password"
                      />
                    </div>
                  </div>
                </>
              ) : currentField === 'rakuten' ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rakutenKey">Client ID</Label>
                      <Input
                        id="rakutenKey"
                        value={formData.rakutenKey}
                        onChange={(e) => handleFieldChange('rakutenKey', e.target.value)}
                        placeholder="Enter Rakuten Client ID"
                        type="password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rakutenSecret">Client Secret</Label>
                      <Input
                        id="rakutenSecret"
                        value={formData.rakutenSecret}
                        onChange={(e) => handleFieldChange('rakutenSecret', e.target.value)}
                        placeholder="Enter Rakuten Client Secret"
                        type="password"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Label htmlFor={currentField}>{fields.find(f => f.key === currentField)?.label}</Label>
                  <Input
                    id={currentField}
                    value={formData[currentField as keyof typeof formData]}
                    onChange={(e) => handleFieldChange(currentField as keyof typeof formData, e.target.value)}
                    placeholder={`Enter ${fields.find(f => f.key === currentField)?.label}`}
                    type="password"
                  />
                </>
              )}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentField(null)}
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    setShowConfetti(true);
                    setTimeout(() => {
                      setShowConfetti(false);
                      setCurrentField(null);
                    }, 1000);
                  }}
                >
                  Save Key
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 dark:hover:bg-muted/80"
                >
                  <div>
                    <h4 className="font-medium">{field.label}</h4>
                    <p className="text-sm text-muted-foreground">
                      {field.key === 'shareasale' ? (
                        formData.shareASaleToken && formData.shareASaleSecretKey ? "••••••••" : "Not set"
                      ) : field.key === 'rakuten' ? (
                        formData.rakutenKey && formData.rakutenSecret ? "••••••••" : "Not set"
                      ) : (
                        formData[field.key as keyof typeof formData] ? "••••••••" : "Not set"
                      )}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentField(field.key)}
                  >
                    Edit
                  </Button>
                </div>
              ))}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save All Changes"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 