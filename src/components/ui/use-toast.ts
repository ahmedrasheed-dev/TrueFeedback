import { toast as toastManager } from "@/components/ui/toast";

type ToastOptions = {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
};

export function useToast() {
    return {
        toast,
    };
}

export const toast = (options: ToastOptions) => {
    toastManager.add({
        title: options.title,
        description: options.description,
        type: options.variant === "destructive" ? "error" : "success",
    });
};
