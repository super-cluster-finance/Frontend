"use client";
import { useEffect, useState } from "react";

export interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function AssetModal({ isOpen, onClose, children }: AssetModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      setTimeout(() => setIsAnimating(true), 60);
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "unset";
      setTimeout(() => setIsVisible(false), 300);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className="el-dialog fixed inset-0 z-50 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Modal container - flex centered */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="asset-dialog-title"
          className={`relative w-full max-w-2xl max-h-[calc(100vh-2rem)]
    overflow-y-auto transform overflow-hidden rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 text-left shadow-xl transition-all duration-300 ease-out ${
      isAnimating
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 translate-y-4 scale-95"
    }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="px-4 py-5 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
