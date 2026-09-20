import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-white rounded-xl shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pb-3", className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        className
      )}
      {...props}
    />
  );
}

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  return (
    <div className={cn("h-1.5 bg-gray-100 rounded-full overflow-hidden", className)}>
      <div
        className="h-full bg-brand transition-all duration-500 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-gray-100 w-full", className)} />;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full h-11 px-4 rounded-lg border border-gray-200 text-sm outline-none",
        "focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all",
        "placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none resize-none",
        "focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all",
        "placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full h-11 px-4 rounded-lg border border-gray-200 text-sm outline-none bg-white",
        "focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all",
        className
      )}
      {...props}
    />
  );
}
