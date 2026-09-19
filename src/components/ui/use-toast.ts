import { toast as toastManager } from "@/components/ui/toast";

type ToastOptions = {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
};

export function useToast() {
    return {
        toast: ({ title, description, variant }: ToastOptions) => {
            toastManager.add({
                title,
                description,
                type: variant === "destructive" ? "error" : "success",
            });
        },
    };
}

export const toast = (options: ToastOptions) => {
    toastManager.add({
        title: options.title,
        description: options.description,
        type: options.variant === "destructive" ? "error" : "success",
    });
};
