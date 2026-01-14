declare module "toastify-js" {
  export interface ToastifyOptions {
    text: string;
    duration?: number;
    selector?: string;
    gravity?: "top" | "bottom";
    position?: "left" | "center" | "right";
    style?: Record<string, string>;
    className?: string;
  }

  export interface ToastInstance {
    showToast: () => void;
    hideToast?: () => void;
  }

  export default function Toastify(options: ToastifyOptions): ToastInstance;
}
