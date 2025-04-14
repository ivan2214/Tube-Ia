import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
interface ContainerFormProps {
  children: ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}

const Container: React.FC<ContainerFormProps> = ({ children, className }) => {
  return (
    <section className={cn("container mx-auto w-full py-12", className)}>
      {children}
    </section>
  );
};

export default Container;
